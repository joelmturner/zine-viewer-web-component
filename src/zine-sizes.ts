/**
 * named page boxes for <zine-viewer> (--page-width / --page-height).
 * values are integers in px so resizeContainer() parseInt() keeps working.
 */

export interface ZinePageDimensions {
  pageWidth: number;
  pageHeight: number;
}

// one panel of 8-page US Letter 4×2 landscape (~2.75×4.25 in); 11:17
const LETTER_8UP: ZinePageDimensions = { pageWidth: 291, pageHeight: 450 };

export const ZINE_PAGE_DIMENSION_DEFAULT: ZinePageDimensions = {
  pageWidth: LETTER_8UP.pageWidth,
  pageHeight: LETTER_8UP.pageHeight,
};

const PRESETS: Readonly<Record<string, ZinePageDimensions>> = {
  "letter-8up": LETTER_8UP,
  // half-sheet 5.5×8.5 in — same 11:17 ratio as letter-8up
  "letter-half": LETTER_8UP,
  a5: { pageWidth: 148, pageHeight: 210 },
  a6: { pageWidth: 105, pageHeight: 148 },
  square: { pageWidth: 300, pageHeight: 300 },
  "digest-6x9": { pageWidth: 240, pageHeight: 360 },
};

/**
 * dimensions for a known preset id, or null when `size` should defer to :host CSS
 * (empty/whitespace or unknown id).
 */
export function lookupZinePresetDimensions(
  presetId: string | null | undefined,
): ZinePageDimensions | null {
  if (presetId == null || presetId.trim() === "") return null;
  const key = presetId.trim().toLowerCase();
  const found = PRESETS[key];
  return found ? { ...found } : null;
}

/**
 * resolves a preset id to page dimensions; missing or unknown → letter-8up default.
 */
export function resolveZinePageDimensions(
  presetId: string | null | undefined,
): ZinePageDimensions {
  if (presetId == null || presetId.trim() === "") {
    return { ...ZINE_PAGE_DIMENSION_DEFAULT };
  }
  const key = presetId.trim().toLowerCase();
  const found = PRESETS[key];
  return found ? { ...found } : { ...ZINE_PAGE_DIMENSION_DEFAULT };
}
