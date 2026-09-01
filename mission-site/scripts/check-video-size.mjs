import { readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function findOversizedVideos(directory, maxBytes) {
  return readdirSync(directory)
    .filter((filename) => filename.toLowerCase().endsWith(".mp4"))
    .filter((filename) => {
      const stats = statSync(join(directory, filename));
      return stats.isFile() && stats.size >= maxBytes;
    })
    .sort();
}

const scriptPath = fileURLToPath(import.meta.url);

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const videoDirectory = join(dirname(scriptPath), "..", "public", "videos");
  const oversizedVideos = findOversizedVideos(
    videoDirectory,
    100 * 1024 * 1024,
  );

  if (oversizedVideos.length > 0) {
    console.error(
      `Video files must be smaller than 100MB: ${oversizedVideos.join(", ")}`,
    );
    process.exitCode = 1;
  }
}
