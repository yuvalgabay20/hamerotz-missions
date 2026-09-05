/* oxlint-disable jsx-a11y/media-has-caption */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
"use client";

import { useState } from "react";
import { sitePath } from "@/lib/site-path";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  title: string;
};

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <p role="status">הסרטון עדיין לא זמין</p>;
  }

  return (
    <video
      className="mission-video"
      aria-label={title}
      controls
      playsInline
      preload="none"
      src={sitePath(src)}
      poster={poster ? sitePath(poster) : undefined}
      onError={() => setFailed(true)}
    >
      הדפדפן אינו תומך בניגון הסרטון.
    </video>
  );
}
