import { describe, expect, it } from "vitest";
import { getMission, missionIds } from "@/lib/missions";

describe("mission catalogue", () => {
  it("returns the complete eight-station catalogue", () => {
    expect(getMission("01")).toEqual({
      id: "01",
      pageType: "תחנה ראשונה",
      question:
        "התחנה הזו במירוץ תיקח אתכם לעולם שונה לחלוטין משלנו.\n\nאיזה עולם מחכה לכם שם?",
      answers: [
        "עולם שבו גולדי היא כלבה ממושמעת ומאולפת.",
        "עולם שבו רמזים, קסמים ושרביטים יכולים לפתוח דלתות.",
        "עולם שבו אוריה זוכרת הכול.",
        "עולם שבו יובל חושב רק חמש מחשבות ביום.",
      ],
      videoFile: "/videos/mission-01.mp4",
    });

    expect(getMission("02")).toMatchObject({
      pageType: "תחנה שנייה",
      question:
        "אומרים שלא כדאי לשמור דברים בבטן, במיוחד אחרי הסמסטר שעברתם.\n\nאיפה תוכלו לפרוק הכול?",
      answers: [
        "ריטריט לפריקת רגשות.",
        "שיעור יוגה כדי להירגע.",
        "מקום שבו שוברים הכול.",
        "מסאז׳ תאילנדי לשחרור המתחים.",
      ],
    });

    expect(getMission("03")).toMatchObject({
      pageType: "תחנה שלישית",
      question:
        "היעד הבא שלכם יישאר חסוי עד שתגיעו אליו. כדי להעביר את הזמן תענו על השאלה הבאה:\n\nבאיזו מחתרת פעלה שרה אהרונסון?",
      answers: ["הפלמ״ח.", "השומר.", "ניל״י.", "לח״י."],
    });

    expect(getMission("04")).toEqual({
      id: "04",
      pageType: "תחנה רביעית",
      question:
        "לא כל משימה במירוץ דורשת לרוץ.\n\nלפעמים צריך לעצור ולפתוח סיפור שנכתב במיוחד בשבילך.\n\nפתחי את החבילה שלפנייך וקראי עד העמוד האחרון.",
      answers: undefined,
      followUp:
        "היום הראשון במירוץ כמעט הגיע לסיומו.\n\nכדי לצבור כוחות לקראת המשך המירוץ מחר, מחכה לכם הערב ארוחה במסעדת סושי.\n\nבתיאבון, המירוץ יימשך מחר.",
      videoFile: "/videos/mission-01.mp4",
    });

    expect(getMission("05")).toMatchObject({
      pageType: "תחנה חמישית",
      question:
        "היום השני במירוץ מתחיל עכשיו.\n\nיש דברים שככל שעובר הזמן, הם רק נעשים טובים יותר.\n\nאיזה מהבאים ידוע כמשתבח עם הזמן?",
      answers: ["מיץ תפוזים.", "חלב.", "גבינת עובש.", "אוריה אלון + יין."],
    });

    expect(getMission("06")).toMatchObject({
      pageType: "תחנה שישית",
      question:
        "התחנה הבאה מחכה לכם במקום של אדם נדיב.\n\nלאן אתם הולכים?",
      answers: [
        "רמת הנדיב.",
        "גבעת הנדיב.",
        "עמק הנדיב.",
        "מישור הנדיב.",
      ],
    });

    expect(getMission("07")).toMatchObject({
      pageType: "תחנה שביעית",
      question:
        "במהלך המירוץ אספתם רמזים, חוויות וזיכרונות.\n\nעכשיו הגיע הזמן לעצור לרגע.\n\nמה עוד נשאר לעשות?",
      answers: [
        "כרטיסי טיסה.",
        "תור לספא.",
        "מתנות.",
        "רכיבה על גמלים.",
      ],
    });

    expect(getMission("08")).toMatchObject({
      pageType: "תחנה שמינית ואחרונה",
      question:
        "לקראת קו הסיום, נותרה שאלה אחת חשובה במיוחד:\n\nמה יובל הכי אוהב לאכול?",
      answers: ["עלים.", "דיונונים.", "פיצה.", "בשר."],
    });
  });

  it("returns no record for an unknown id", () => {
    expect(getMission("99")).toBeUndefined();
    expect(missionIds).toEqual(["01", "02", "03", "04", "05", "06", "07", "08"]);
  });

  it("freezes mission 01 and its answers at runtime", () => {
    const mission = getMission("01");
    expect(mission).toBeDefined();
    expect(Object.isFrozen(mission)).toBe(true);
    expect(Object.isFrozen(mission?.answers)).toBe(true);
  });
});
