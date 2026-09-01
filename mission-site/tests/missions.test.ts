import { describe, expect, it } from "vitest";
import { getMission, missionIds } from "@/lib/missions";

describe("mission catalogue", () => {
  it("returns the complete static mission 01 record", () => {
    expect(getMission("01")).toEqual({
      id: "01",
      pageType: "סימן דרך",
      questionNumber: 1,
      question: "באיזו עיר נמצא מגדל אייפל?",
      answers: ["פריז", "רומא", "לונדון", "מדריד"],
      videoFile: "/videos/mission-01.mp4",
    });
  });

  it("returns no record for an unknown id", () => {
    expect(getMission("99")).toBeUndefined();
    expect(missionIds).toEqual(["01"]);
  });

  it("freezes mission 01 and its answers at runtime", () => {
    const mission = getMission("01");
    expect(mission).toBeDefined();
    expect(Object.isFrozen(mission)).toBe(true);
    expect(Object.isFrozen(mission?.answers)).toBe(true);
  });
});
