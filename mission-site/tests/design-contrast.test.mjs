import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function luminance(hex) {
  const channels = hexToRgb(hex).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first, second) {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function cssHex(css, customProperty) {
  const match = css.match(new RegExp(`${customProperty}\\s*:\\s*(#[0-9a-f]{6})`, "i"));
  if (!match) throw new Error(`Missing CSS color token ${customProperty}`);
  return match[1];
}

describe("question number contrast", () => {
  it("uses a dedicated text gold with WCAG AA contrast on paper and white", () => {
    const css = readFileSync(join(import.meta.dirname, "..", "app", "globals.css"), "utf8");
    const textGold = cssHex(css, "--race-gold-text");
    const paper = cssHex(css, "--race-paper");
    const missionNumber = css.match(/\.mission-number\s*\{[\s\S]*?color:\s*var\((--[a-z-]+)\)/i);

    expect(missionNumber?.[1]).toBe("--race-gold-text");
    expect(contrastRatio(textGold, paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(textGold, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });
});
