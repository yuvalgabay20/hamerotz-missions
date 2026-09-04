/* oxlint-disable jsx-a11y/media-has-caption */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
"use client";

import { useRef, useState } from "react";
import { sitePath } from "@/lib/site-path";

type VideoPlayerProps = {
  src: string;
  src4k?: string;
  poster?: string;
  title: string;
};

export function VideoPlayer({ src, src4k, poster, title }: VideoPlayerProps) {
  const [failed, setFailed] = useState(false);
  const [quality, setQuality] = useState("1080");
  const videoRef = useRef<HTMLVideoElement>(null);
  const resume = useRef<{ time: number; playing: boolean } | null>(null);

  function changeQuality(next: string) {
    const video = videoRef.current;
    if (video) resume.current = { time: video.currentTime, playing: !video.paused };
    setFailed(false);
    setQuality(next);
  }

  if (failed) {
    return <p role="status">הסרטון עדיין לא זמין</p>;
  }

  return (
    <>
    <video
      ref={videoRef}
      className="mission-video"
      aria-label={title}
      controls
      playsInline
      preload="none"
      src={sitePath(quality === "4k" && src4k ? src4k : src)}
      poster={poster ? sitePath(poster) : undefined}
      onError={() => setFailed(true)}
      onLoadedMetadata={() => {
        const video = videoRef.current;
        const previous = resume.current;
        if (!video || !previous) return;
        resume.current = null;
        video.currentTime = Math.min(previous.time, video.duration);
        if (previous.playing) void video.play().catch(() => {});
      }}
    >
      הדפדפן אינו תומך בניגון הסרטון.
    </video>
    {src4k ? (
      <label className="video-quality">
        איכות צפייה
        <select value={quality} onChange={(event) => changeQuality(event.target.value)}>
          <option value="1080">Full HD — טעינה מהירה</option>
          <option value="4k">4K — איכות גבוהה</option>
        </select>
      </label>
    ) : null}
    </>
  );
}
