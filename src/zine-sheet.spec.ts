import { describe, expect, it } from "vitest";
import {
  leavesFromPortraitLetterSheet,
  placeSheetCell,
} from "./zine-sheet.js";

describe("leavesFromPortraitLetterSheet", () => {
  const leaves = leavesFromPortraitLetterSheet("tea.jpg");

  it("builds four leaves", () => {
    expect(leaves).toHaveLength(4);
    expect(leaves.map(leaf => leaf.index)).toEqual([0, 1, 2, 3]);
  });

  it("pairs pages 1+2, 3+4, 5+6, 7+8 with the sheet's quarter turns", () => {
    expect(leaves[0]).toEqual({
      index: 0,
      front: { src: "tea.jpg", cell: { col: 0, row: 1, turn: -90 } },
      back: { src: "tea.jpg", cell: { col: 0, row: 2, turn: -90 } },
    });
    expect(leaves[1]).toEqual({
      index: 1,
      front: { src: "tea.jpg", cell: { col: 0, row: 3, turn: -90 } },
      back: { src: "tea.jpg", cell: { col: 1, row: 3, turn: 90 } },
    });
    expect(leaves[2]).toEqual({
      index: 2,
      front: { src: "tea.jpg", cell: { col: 1, row: 2, turn: 90 } },
      back: { src: "tea.jpg", cell: { col: 1, row: 1, turn: 90 } },
    });
    expect(leaves[3]).toEqual({
      index: 3,
      front: { src: "tea.jpg", cell: { col: 1, row: 0, turn: 90 } },
      back: { src: "tea.jpg", cell: { col: 0, row: 0, turn: -90 } },
    });
  });
});

describe("placeSheetCell", () => {
  // sheet is exactly 2 face-heights wide and 4 face-widths tall, so the
  // turned cell matches a 291×450 page with no crop
  const face = { width: 291, height: 450 };
  const sheet = { width: 900, height: 1164 };
  const cover = { col: 0 as const, row: 1 as const, turn: -90 as const };

  it("places the cover cell over a letter-8up page", () => {
    expect(placeSheetCell(face, cover, sheet)).toEqual({
      width: 900,
      height: 1164,
      left: -79.5,
      top: -211.5,
      originX: 25,
      originY: 37.5,
      rotate: -90,
    });
  });

  it("scales up until the turned cell covers a mismatched face", () => {
    const squareSheet = { width: 1000, height: 1000 };
    const placed = placeSheetCell(face, cover, squareSheet);
    expect(placed).not.toBeNull();
    // cell is 500×250. after the turn it is 250 wide, which is short of 291
    const scale = 291 / 250;
    expect(placed!.width).toBeCloseTo(scale * 1000);
    expect(placed!.height).toBeCloseTo(scale * 1000);
    expect(placed!.rotate).toBe(-90);
  });

  it("returns null when a size is zero", () => {
    expect(placeSheetCell({ width: 0, height: 450 }, cover, sheet)).toBeNull();
    expect(placeSheetCell(face, cover, { width: 0, height: 100 })).toBeNull();
  });
});
