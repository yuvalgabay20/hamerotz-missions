export type Mission = Readonly<{
  id: string;
  pageType: string;
  questionNumber: number;
  question: string;
  answers: readonly [string, string, string, string];
  videoFile: string;
  videoPoster?: string;
}>;

const missions = {
  "01": {
    id: "01",
    pageType: "סימן דרך",
    questionNumber: 1,
    question: "באיזו עיר נמצא מגדל אייפל?",
    answers: ["פריז", "רומא", "לונדון", "מדריד"],
    videoFile: "/videos/mission-01.mp4",
  },
} as const satisfies Record<string, Mission>;

export const missionIds = Object.freeze(Object.keys(missions));

export function getMission(id: string): Mission | undefined {
  if (!Object.prototype.hasOwnProperty.call(missions, id)) {
    return undefined;
  }

  return missions[id as keyof typeof missions];
}
