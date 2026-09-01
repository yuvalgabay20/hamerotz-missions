export type Mission = Readonly<{
  id: string;
  pageType: string;
  questionNumber: number;
  question: string;
  answers: readonly [string, string, string, string];
  videoFile: string;
  videoPoster?: string;
}>;

const mission01 = Object.freeze({
  id: "01",
  pageType: "סימן דרך",
  questionNumber: 1,
  question: "באיזו עיר נמצא מגדל אייפל?",
  answers: Object.freeze(["פריז", "רומא", "לונדון", "מדריד"] as const),
  videoFile: "/videos/mission-01.mp4",
} satisfies Mission);

const missions = Object.freeze({
  "01": mission01,
} satisfies Record<string, Mission>);

export const missionIds = Object.freeze(Object.keys(missions));

export function getMission(id: string): Mission | undefined {
  if (!Object.prototype.hasOwnProperty.call(missions, id)) {
    return undefined;
  }

  return missions[id as keyof typeof missions];
}
