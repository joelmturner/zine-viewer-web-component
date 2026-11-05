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

/** canonical `size` attribute values. matching is case-insensitive at runtime. */
export const ZINE_SIZE_PRESETS = [
  "letter-8up",
  "letter-half",
  "a5",
  "a6",
  "square",
  "digest-6x9",
] as const;

export type ZineSizePreset = (typeof ZINE_SIZE_PRESETS)[number];

/** a preset id, or "" to leave sizing to :host --page-width / --page-height. */
export type ZineSize = ZineSizePreset | "";

const PRESET_IDS: ReadonlySet<string> = new Set(ZINE_SIZE_PRESETS);

const PRESETS: Record<ZineSizePreset, ZinePageDimensions> = {
  "letter-8up": LETTER_8UP,
  // half-sheet 5.5×8.5 in — same 11:17 ratio as letter-8up
  "letter-half": LETTER_8UP,
  a5: { pageWidth: 148, pageHeight: 210 },
  a6: { pageWidth: 105, pageHeight: 148 },
  square: { pageWidth: 300, pageHeight: 300 },
  "digest-6x9": { pageWidth: 240, pageHeight: 360 },
};

function isZineSizePreset(value: string): value is ZineSizePreset {
  return PRESET_IDS.has(value);
}

function dimensionsForPresetId(
  presetId: string | null | undefined,
): ZinePageDimensions | null {
  if (presetId == null || presetId.trim() === "") return null;
  const key = presetId.trim().toLowerCase();
  if (!isZineSizePreset(key)) return null;
  return { ...PRESETS[key] };
}

/**
 * dimensions for a known preset id, or null when `size` should defer to :host CSS
 * (empty/whitespace or unknown id).
 */
export function lookupZinePresetDimensions(
  presetId: string | null | undefined,
): ZinePageDimensions | null {
  return dimensionsForPresetId(presetId);
}

/**
 * resolves a preset id to page dimensions; missing or unknown → letter-8up default.
 */
export function resolveZinePageDimensions(
  presetId: string | null | undefined,
): ZinePageDimensions {
  return dimensionsForPresetId(presetId) ?? { ...ZINE_PAGE_DIMENSION_DEFAULT };
}
