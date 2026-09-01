/* oxlint-disable next/no-img-element */
/* oxlint-disable jsx-a11y/media-has-caption */
import type { Mission } from "@/lib/missions";
import { sitePath } from "@/lib/site-path";

export function MissionPage({ mission }: { mission: Mission }) {
  return (
    <main className="mission-shell">
      <article className="mission-card">
        <img
          className="mission-logo"
          src={sitePath("/brand/amazing-race-logo.png")}
          alt="המירוץ למיליון"
          width="448"
          height="220"
        />
        <h1 className="mission-page-type">{mission.pageType}</h1>
        <p className="mission-number">שאלה {mission.questionNumber}</p>
        <h2 className="mission-question">{mission.question}</h2>
        <ol className="mission-answers">
          {mission.answers.map((answer) => (
            <li key={answer}>{answer}</li>
          ))}
        </ol>
        <video
          className="mission-video"
          aria-label={`סרטון משימה ${mission.questionNumber}`}
          controls
          playsInline
          preload="metadata"
          src={sitePath(mission.videoFile)}
        >
          הדפדפן אינו תומך בניגון הסרטון.
        </video>
      </article>
    </main>
  );
}
