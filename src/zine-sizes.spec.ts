import { describe, it, expect } from "vitest";
import {
  lookupZinePresetDimensions,
  resolveZinePageDimensions,
  ZINE_PAGE_DIMENSION_DEFAULT,
} from "./zine-sizes.js";

describe("lookupZinePresetDimensions", () => {
  it("returns null for empty or whitespace", () => {
    expect(lookupZinePresetDimensions("")).toBeNull();
    expect(lookupZinePresetDimensions("   ")).toBeNull();
    expect(lookupZinePresetDimensions(null)).toBeNull();
    expect(lookupZinePresetDimensions(undefined)).toBeNull();
  });

  it("returns null for unknown id", () => {
    expect(lookupZinePresetDimensions("nope")).toBeNull();
  });

  it("matches known presets case-insensitively", () => {
    expect(lookupZinePresetDimensions("a5")).toEqual({
      pageWidth: 148,
      pageHeight: 210,
    });
    expect(lookupZinePresetDimensions("A5")).toEqual({
      pageWidth: 148,
      pageHeight: 210,
    });
    expect(lookupZinePresetDimensions("letter-8up")).toEqual({
      pageWidth: 291,
      pageHeight: 450,
    });
    expect(lookupZinePresetDimensions("letter-half")).toEqual({
      pageWidth: 291,
      pageHeight: 450,
    });
    expect(lookupZinePresetDimensions("digest-6x9")).toEqual({
      pageWidth: 240,
      pageHeight: 360,
    });
  });
});

describe("resolveZinePageDimensions", () => {
  it("returns default for empty or unknown", () => {
    expect(resolveZinePageDimensions("")).toEqual(ZINE_PAGE_DIMENSION_DEFAULT);
    expect(resolveZinePageDimensions("bad")).toEqual(
      ZINE_PAGE_DIMENSION_DEFAULT,
    );
  });

  it("returns dimensions for known id", () => {
    expect(resolveZinePageDimensions("square")).toEqual({
      pageWidth: 300,
      pageHeight: 300,
    });
    expect(resolveZinePageDimensions("a6")).toEqual({
      pageWidth: 105,
      pageHeight: 148,
    });
  });
});
