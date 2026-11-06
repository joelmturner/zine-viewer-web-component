/**
 * portrait letter sheet: 2 columns, 4 rows.
 * left column turns counter-clockwise, right column clockwise.
 * cells, top to bottom:
 *   8 7
 *   1 6
 *   2 5
 *   3 4
 * pages pair onto leaves as 1+2, 3+4, 5+6, 7+8.
 */

export interface SheetCell {
  col: 0 | 1;
  row: 0 | 1 | 2 | 3;
  /** degrees clockwise, matching CSS rotate() */
  turn: 90 | -90;
}

export interface SheetFace {
  src: string;
  cell: SheetCell;
}

export interface SheetLeaf {
  index: number;
  front: SheetFace;
  back: SheetFace;
}

export interface FaceBox {
  width: number;
  height: number;
}

export interface SheetPixels {
  width: number;
  height: number;
}

export interface SheetFacePlacement {
  width: number;
  height: number;
  left: number;
  top: number;
  /** percent of the sheet image, for CSS transform-origin */
  originX: number;
  originY: number;
  rotate: 90 | -90;
}

const TURN_LEFT = -90;
const TURN_RIGHT = 90;

function face(src: string, col: 0 | 1, row: 0 | 1 | 2 | 3): SheetFace {
  return {
    src,
    cell: { col, row, turn: col === 0 ? TURN_LEFT : TURN_RIGHT },
  };
}

/** four leaves for one portrait letter sheet. page 1 is the cover, page 8 is the back. */
export function leavesFromPortraitLetterSheet(sheetUrl: string): SheetLeaf[] {
  return [
    { index: 0, front: face(sheetUrl, 0, 1), back: face(sheetUrl, 0, 2) },
    { index: 1, front: face(sheetUrl, 0, 3), back: face(sheetUrl, 1, 3) },
    { index: 2, front: face(sheetUrl, 1, 2), back: face(sheetUrl, 1, 1) },
    { index: 3, front: face(sheetUrl, 1, 0), back: face(sheetUrl, 0, 0) },
  ];
}

/**
 * place one cell so that, after its quarter turn, it covers the face box.
 * the sheet keeps its aspect. overflow on the face clips the rest.
 */
export function placeSheetCell(
  faceBox: FaceBox,
  cell: SheetCell,
  sheet: SheetPixels,
): SheetFacePlacement | null {
  if (
    faceBox.width <= 0 ||
    faceBox.height <= 0 ||
    sheet.width <= 0 ||
    sheet.height <= 0
  ) {
    return null;
  }

  const cellWidth = sheet.width / 2;
  const cellHeight = sheet.height / 4;
  // a quarter turn swaps the cell's width and height
  const scale = Math.max(
    faceBox.width / cellHeight,
    faceBox.height / cellWidth,
  );
  const width = scale * sheet.width;
  const height = scale * sheet.height;
  const centerX = (cell.col + 0.5) * (width / 2);
  const centerY = (cell.row + 0.5) * (height / 4);

  return {
    width,
    height,
    left: faceBox.width / 2 - centerX,
    top: faceBox.height / 2 - centerY,
    originX: ((cell.col + 0.5) / 2) * 100,
    originY: ((cell.row + 0.5) / 4) * 100,
    rotate: cell.turn,
  };
}
