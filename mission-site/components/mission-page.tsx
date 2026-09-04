/* oxlint-disable next/no-img-element */
import type { Mission } from "@/lib/missions";
import { VideoPlayer } from "@/components/video-player";
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
        <h2 className="mission-question">{mission.question}</h2>
        {mission.answers ? (
          <ol className="mission-answers">
            {mission.answers.map((answer) => (
              <li key={answer}>{answer}</li>
            ))}
          </ol>
        ) : null}
        {mission.followUp ? (
          <p className="mission-follow-up">{mission.followUp}</p>
        ) : null}
        <VideoPlayer
          src={mission.videoFile}
          src4k={mission.video4k}
          poster={mission.videoPoster}
          title={`סרטון ${mission.pageType}`}
        />
      </article>
    </main>
  );
}
