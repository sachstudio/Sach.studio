import { describe, expect, it } from "vitest";
import { axisMax, axisTicks, barHeightPercent } from "./chart-math";

describe("axisMax", () => {
  it("rounds the tallest bar up to a multiple of four so the four gridlines land on whole numbers", () => {
    expect(axisMax([2, 0, 2, 0])).toBe(4);
    expect(axisMax([5, 1])).toBe(8);
    expect(axisMax([8, 3])).toBe(8);
    expect(axisMax([9])).toBe(12);
  });

  it("never goes below four, even for an empty chart", () => {
    expect(axisMax([])).toBe(4);
    expect(axisMax([0, 0, 0, 0])).toBe(4);
    expect(axisMax([1])).toBe(4);
  });
});

describe("axisTicks", () => {
  it("lists the gridline values from zero to the top of the axis", () => {
    expect(axisTicks(8)).toEqual([0, 2, 4, 6, 8]);
    expect(axisTicks(4)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("barHeightPercent", () => {
  it("is the share of the axis the bar fills", () => {
    expect(barHeightPercent(4, 8)).toBe(50);
    expect(barHeightPercent(8, 8)).toBe(100);
    expect(barHeightPercent(0, 8)).toBe(0);
  });

  it("never goes past the top of the chart or below zero", () => {
    expect(barHeightPercent(20, 8)).toBe(100);
    expect(barHeightPercent(-3, 8)).toBe(0);
  });

  it("is zero rather than NaN when the axis is empty", () => {
    expect(barHeightPercent(3, 0)).toBe(0);
  });
});
