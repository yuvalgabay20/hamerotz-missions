export type Mission = Readonly<{
  id: string;
  pageType: string;
  question: string;
  answers?: readonly [string, string, string, string];
  followUp?: string;
  videoFile: string;
  videoPoster?: string;
}>;

const videoFile = "/videos/mission-01.mp4";

const mission01 = Object.freeze({
  id: "01",
  pageType: "תחנה ראשונה",
  question:
    "התחנה הזו במירוץ תיקח אתכם לעולם שונה לחלוטין משלנו.\n\nאיזה עולם מחכה לכם שם?",
  answers: Object.freeze([
    "עולם שבו גולדי הוא כלב ממושמע ומאולף.",
    "עולם שבו רמזים, קסמים ושרביטים יכולים לפתוח דלתות.",
    "עולם שבו אוריה זוכרת הכול.",
    "עולם שבו יובל חושב רק חמש מחשבות ביום.",
  ] as const),
  videoFile,
} satisfies Mission);

const mission02 = Object.freeze({
  id: "02",
  pageType: "תחנה שנייה",
  question:
    "אומרים שלא כדאי לשמור דברים בבטן, במיוחד אחרי הסמסטר שעברתם.\n\nאיפה תוכלו לפרוק הכול?",
  answers: Object.freeze([
    "ריטריט לפריקת רגשות.",
    "שיעור יוגה כדי להירגע.",
    "מקום שבו שוברים הכול.",
    "מסאז׳ תאילנדי לשחרור המתחים.",
  ] as const),
  videoFile,
} satisfies Mission);

const mission03 = Object.freeze({
  id: "03",
  pageType: "תחנה שלישית",
  question:
    "היעד הבא שלכם יישאר חסוי עד שתגיעו אליו. כדי להעביר את הזמן תענו על השאלה הבאה:\n\nבאיזו מחתרת פעלה שרה אהרונסון?",
  answers: Object.freeze(["הפלמ״ח.", "השומר.", "ניל״י.", "לח״י."] as const),
  videoFile,
} satisfies Mission);

const mission04 = Object.freeze({
  id: "04",
  pageType: "תחנה רביעית",
  question:
    "לא כל משימה במירוץ דורשת לרוץ.\n\nלפעמים צריך לעצור ולפתוח סיפור שנכתב במיוחד בשבילך.\n\nפתחי את החבילה שלפנייך וקראי עד העמוד האחרון.",
  followUp:
    "היום הראשון במירוץ כמעט הגיע לסיומו.\n\nכדי לצבור כוחות לקראת המשך המירוץ מחר, מחכה לכם הערב ארוחה במסעדת סושי.\n\nבתיאבון, המירוץ יימשך מחר.",
  videoFile,
} satisfies Mission);

const mission05 = Object.freeze({
  id: "05",
  pageType: "תחנה חמישית",
  question:
    "היום השני במירוץ מתחיל עכשיו.\n\nיש דברים שככל שעובר הזמן, הם רק נעשים טובים יותר.\n\nאיזה מהבאים ידוע כמשתבח עם הזמן?",
  answers: Object.freeze([
    "מיץ תפוזים.",
    "חלב.",
    "גבינת עובש.",
    "אוריה אלון + יין.",
  ] as const),
  videoFile,
} satisfies Mission);

const mission06 = Object.freeze({
  id: "06",
  pageType: "תחנה שישית",
  question:
    "התחנה הבאה מחכה לכם במקום של אדם נדיב.\n\nלאן אתם הולכים?",
  answers: Object.freeze([
    "רמת הנדיב.",
    "גבעת הנדיב.",
    "עמק הנדיב.",
    "מישור הנדיב.",
  ] as const),
  videoFile,
} satisfies Mission);

const mission07 = Object.freeze({
  id: "07",
  pageType: "תחנה שביעית",
  question:
    "במהלך המירוץ אספתם רמזים, חוויות וזיכרונות.\n\nעכשיו הגיע הזמן לעצור לרגע.\n\nמה עוד נשאר לעשות?",
  answers: Object.freeze([
    "כרטיסי טיסה.",
    "תור לספא.",
    "מתנות.",
    "רכיבה על גמלים.",
  ] as const),
  videoFile,
} satisfies Mission);

const mission08 = Object.freeze({
  id: "08",
  pageType: "תחנה שמינית ואחרונה",
  question:
    "לקראת קו הסיום, נותרה שאלה אחת חשובה במיוחד:\n\nמה יובל הכי אוהב לאכול?",
  answers: Object.freeze(["עלים.", "דיונונים.", "פיצה.", "בשר."] as const),
  videoFile,
} satisfies Mission);

const missions = Object.freeze({
  "01": mission01,
  "02": mission02,
  "03": mission03,
  "04": mission04,
  "05": mission05,
  "06": mission06,
  "07": mission07,
  "08": mission08,
} satisfies Record<string, Mission>);

export const missionIds = Object.freeze(Object.keys(missions));

export function getMission(id: string): Mission | undefined {
  if (!Object.prototype.hasOwnProperty.call(missions, id)) {
    return undefined;
  }

  return missions[id as keyof typeof missions];
}
