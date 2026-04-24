import { describe, it, expect } from "vitest";
import {
  loadZinePages,
  createInitialSnapshot,
  pageIsFlipped,
  canFlipForward,
  canFlipBackward,
  flipForward,
  flipBackward,
  getZIndices,
} from "./zine-book.js";

function hostWithChildren(
  attrs: Array<{ img: string; back: string }>
): HTMLElement {
  const host = document.createElement("div");
  for (const a of attrs) {
    const c = document.createElement("div");
    c.setAttribute("img-src", a.img);
    c.setAttribute("back-img-src", a.back);
    host.appendChild(c);
  }
  return host;
}

describe("loadZinePages", () => {
  it("parses object array from JSON", () => {
    const json = JSON.stringify([
      { img: "a.jpg", backImg: "b.jpg" },
      { img: "c.jpg", backImg: "d.jpg" },
    ]);
    const host = document.createElement("div");
    const pages = loadZinePages(json, host);
    expect(pages).toEqual([
      { imgSrc: "a.jpg", backImgSrc: "b.jpg", index: 0 },
      { imgSrc: "c.jpg", backImgSrc: "d.jpg", index: 1 },
    ]);
  });

  it("parses tuple array from JSON", () => {
    const json = JSON.stringify([
      ["a.jpg", "b.jpg"],
      ["c.jpg", "d.jpg"],
    ]);
    const pages = loadZinePages(json, document.createElement("div"));
    expect(pages[0]).toEqual({ imgSrc: "a.jpg", backImgSrc: "b.jpg", index: 0 });
  });

  it("falls back to light DOM children on invalid JSON", () => {
    const host = hostWithChildren([{ img: "x.jpg", back: "y.jpg" }]);
    const pages = loadZinePages("{not json", host);
    expect(pages).toEqual([{ imgSrc: "x.jpg", backImgSrc: "y.jpg", index: 0 }]);
  });

  it("falls back when JSON is not an array", () => {
    const host = hostWithChildren([{ img: "1.jpg", back: "2.jpg" }]);
    const pages = loadZinePages(JSON.stringify({ foo: 1 }), host);
    expect(pages).toHaveLength(1);
  });

  it("uses children when pages attribute is empty", () => {
    const host = hostWithChildren([{ img: "a.jpg", back: "b.jpg" }]);
    const pages = loadZinePages("", host);
    expect(pages[0].imgSrc).toBe("a.jpg");
  });
});

describe("BookSnapshot", () => {
  it("flips forward and backward with invariants", () => {
    let s = createInitialSnapshot(2);
    expect(s.currentPage).toBe(0);
    expect(pageIsFlipped(0, s)).toBe(false);

    s = flipForward(s)!;
    expect(s.currentPage).toBe(1);
    expect(pageIsFlipped(0, s)).toBe(true);
    expect(pageIsFlipped(1, s)).toBe(false);

    s = flipForward(s)!;
    expect(s.currentPage).toBe(2);
    expect(canFlipForward(s)).toBe(false);

    s = flipBackward(s)!;
    expect(s.currentPage).toBe(1);
    expect(flipForward(createInitialSnapshot(0))).toBeNull();
    expect(flipBackward(createInitialSnapshot(0))).toBeNull();
  });

  it("getZIndices forward matches legacy stack for three pages", () => {
    const n = 3;
    expect(getZIndices({ pageCount: n, currentPage: 0 }, "forward")).toEqual([
      4, 2, 1,
    ]);
    expect(getZIndices({ pageCount: n, currentPage: 1 }, "forward")).toEqual([
      4, 2, 1,
    ]);
    expect(getZIndices({ pageCount: n, currentPage: 2 }, "forward")).toEqual([
      1, 2, 1,
    ]);
    expect(getZIndices({ pageCount: n, currentPage: 3 }, "forward")).toEqual([
      0, 1, 2,
    ]);
  });

  it("getZIndices backward branch for mid stack", () => {
    const n = 3;
    expect(getZIndices({ pageCount: n, currentPage: 2 }, "backward")).toEqual([
      0, 1, 4,
    ]);
  });

  it("initial uses forward stacking recipe", () => {
    expect(
      getZIndices({ pageCount: 3, currentPage: 1 }, "initial")
    ).toEqual(getZIndices({ pageCount: 3, currentPage: 1 }, "forward"));
  });
});
