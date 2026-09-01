# Mission Landing Page Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable Hebrew RTL landing-page template that statically exports one direct URL per mission and plays a mission-specific local MP4.

**Architecture:** A Vinext App Router site owns one shared `MissionPage` component and a typed in-repository mission catalogue. `generateStaticParams()` creates `/missions/<id>/` pages at build time, while `output: "export"` produces files suitable for GitHub Pages. Each new mission requires one catalogue entry and one MP4 file; layout and behavior remain shared.

**Tech Stack:** React 19, TypeScript 5.9, Vinext 1.0 static export, Tailwind CSS 4, shadcn foundation, Vitest, Testing Library, native HTML5 video.

**Spec:** `docs/superpowers/specs/2026-09-01-mission-landing-page-template-design.md`

## Global Constraints

- Every mission is static and has its own `/missions/<id>/` URL.
- Answers are visual text only; they are never buttons, links, or selectable controls.
- Videos are local H.264/AAC MP4 files, never YouTube embeds.
- Video does not autoplay and must expose native controls, fullscreen support, and `playsInline`.
- The page is Hebrew RTL, mobile-first, white-based, navy-and-gold, and uses the already approved logo unchanged.
- There is no mission catalogue page and no navigation between missions.
- Every mission route is `noindex, nofollow`.
- A video file must be below 100MB; the operational target is below 40MB.
- The acceptance-letter QR remains deferred until a real acceptance-video URL exists.

---

## File Structure

```text
mission-site/
├── app/
│   ├── globals.css                 # Shared visual tokens and responsive rules
│   ├── layout.tsx                  # Hebrew RTL document and global metadata
│   ├── not-found.tsx               # Unknown-mission state
│   ├── page.tsx                    # Root deliberately renders the not-found state
│   └── missions/[id]/page.tsx      # Static route and route metadata
├── components/
│   ├── mission-page.tsx            # Shared mission layout
│   └── video-player.tsx            # Native MP4 player and load-error state
├── lib/
│   ├── missions.ts                 # Mission type, catalogue, lookup, route ids
│   └── site-path.ts                # GitHub Pages base-path-safe asset URLs
├── public/
│   ├── brand/amazing-race-logo.png # Approved transparent logo
│   ├── fonts/heebo-variable.ttf    # Hebrew display/body font
│   ├── og.png                      # Existing approved clue-card preview image
│   └── videos/mission-01.mp4       # Synthetic development MP4, replaced by supplied file
├── scripts/
│   └── check-video-size.mjs        # Rejects MP4 files at or above 100MB
├── tests/
│   ├── setup.ts
│   ├── layout.test.tsx
│   ├── missions.test.ts
│   ├── mission-page.test.tsx
│   ├── video-player.test.tsx
│   ├── site-path.test.ts
│   └── check-video-size.test.mjs
├── .github/workflows/pages.yml     # GitHub Pages build and deployment
├── next.config.ts                  # Static export, trailing slash, configurable base path
├── package.json                    # Build, test, and video-check scripts
└── vitest.config.ts                # jsdom test environment
```

---

### Task 1: Scaffold the site and lock Hebrew RTL foundations

**Files:**
- Create: `mission-site/` with the approved Sites scaffold
- Modify: `mission-site/app/layout.tsx`
- Modify: `mission-site/app/globals.css`
- Create: `mission-site/tests/setup.ts`
- Create: `mission-site/tests/layout.test.tsx`
- Create: `mission-site/vitest.config.ts`
- Modify: `mission-site/package.json`
- Create: `mission-site/public/brand/amazing-race-logo.png`
- Create: `mission-site/public/fonts/heebo-variable.ttf`
- Create: `mission-site/public/og.png`

**Interfaces:**
- Consumes: approved logo at `output/clue-card/amazing-race-logo-remake-images2-transparent.png`; approved card at `output/clue-card/clue-card-images2-redesign-approved-logo-v2.png`; Heebo font at `C:/Users/yuval/AppData/Local/Microsoft/Windows/Fonts/Heebo-VariableFont_wght.ttf`.
- Produces: a buildable project whose root document always uses `<html lang="he" dir="rtl">` and exposes shared navy/gold/white design tokens.

- [ ] **Step 1: Scaffold and install the pinned project**

Run from the repository root:

```powershell
npm create --yes @openai/sites@0.3.0 mission-site -- --yes --add-ons shadcn --install
Set-Location mission-site
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

Expected: `mission-site/app/page.tsx`, `mission-site/components/ui/`, `mission-site/package-lock.json`, and `mission-site/.openai/hosting.json` exist.

- [ ] **Step 2: Add the test environment**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"] },
});
```

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Write the failing RTL layout test**

Create `tests/layout.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("marks the complete document as Hebrew RTL", () => {
    const { container } = render(
      <RootLayout><main>תוכן</main></RootLayout>,
    );
    const html = container.querySelector("html");
    expect(html).toHaveAttribute("lang", "he");
    expect(html).toHaveAttribute("dir", "rtl");
  });
});
```

- [ ] **Step 4: Run the test and verify RED**

Run:

```powershell
npm test -- tests/layout.test.tsx
```

Expected: FAIL because the scaffold uses `lang="en"` and no RTL direction.

- [ ] **Step 5: Implement the RTL layout and theme**

Replace the scaffold font setup in `app/layout.tsx` with `next/font/local`, set `lang="he" dir="rtl"`, set the title to `המירוץ למיליון — משימה`, description to `דף משימה אישי`, and set Open Graph/X image metadata to `/og.png`. Set robots metadata to `{ index: false, follow: false }`.

In `app/globals.css`, define and apply these exact tokens:

```css
:root {
  --race-navy: #061d4f;
  --race-blue: #0b347b;
  --race-gold: #c89218;
  --race-gold-light: #e7b943;
  --race-paper: #fffdfa;
  --race-ink-muted: #5c6574;
  --radius: 0.75rem;
}

html { direction: rtl; background: #061d4f; }
body { margin: 0; min-height: 100vh; background: var(--race-paper); color: var(--race-navy); }
```

Copy the three approved assets to the paths listed in this task without altering their pixels.

- [ ] **Step 6: Verify GREEN and build**

Run:

```powershell
npm test -- tests/layout.test.tsx
npm run build
```

Expected: test PASS; build exits 0.

- [ ] **Step 7: Commit**

```powershell
git add mission-site
git commit -m "feat: scaffold Hebrew mission site"
```

---

### Task 2: Add the typed mission catalogue and base-path-safe assets

**Files:**
- Create: `mission-site/lib/missions.ts`
- Create: `mission-site/lib/site-path.ts`
- Create: `mission-site/tests/missions.test.ts`
- Create: `mission-site/tests/site-path.test.ts`

**Interfaces:**
- Produces: `Mission`, `missionIds`, `getMission(id: string): Mission | undefined`, and `sitePath(pathname: string, basePath?: string): string`.
- Consumers: route generation, `MissionPage`, and `VideoPlayer` in later tasks.

- [ ] **Step 1: Write the failing catalogue tests**

Create `tests/missions.test.ts`:

```ts
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
});
```

Create `tests/site-path.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sitePath } from "@/lib/site-path";

describe("sitePath", () => {
  it("adds the GitHub Pages base path exactly once", () => {
    expect(sitePath("/videos/mission-01.mp4", "/race")).toBe(
      "/race/videos/mission-01.mp4",
    );
    expect(sitePath("/videos/mission-01.mp4", "")).toBe(
      "/videos/mission-01.mp4",
    );
  });
});
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm test -- tests/missions.test.ts tests/site-path.test.ts
```

Expected: FAIL because `lib/missions.ts` and `lib/site-path.ts` do not exist.

- [ ] **Step 3: Implement the catalogue and helper**

Create `lib/missions.ts` with this public type:

```ts
export type Mission = Readonly<{
  id: string;
  pageType: string;
  questionNumber: number;
  question: string;
  answers: readonly [string, string, string, string];
  videoFile: string;
  videoPoster?: string;
}>;
```

Define an immutable mission 01 record with the exact data from the test, export `missionIds` from the record keys, and return catalogue entries through `getMission`.

Create `lib/site-path.ts`:

```ts
export function sitePath(pathname: string, basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "") {
  const cleanBase = basePath.replace(/\/$/, "");
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${cleanBase}${cleanPath}`;
}
```

- [ ] **Step 4: Verify GREEN**

Run:

```powershell
npm test -- tests/missions.test.ts tests/site-path.test.ts
```

Expected: both files PASS.

- [ ] **Step 5: Commit**

```powershell
git add mission-site/lib mission-site/tests
git commit -m "feat: add typed mission catalogue"
```

---

### Task 3: Build the first recognizable mission page

**Files:**
- Create: `mission-site/components/mission-page.tsx`
- Create: `mission-site/app/missions/[id]/page.tsx`
- Modify: `mission-site/app/globals.css`
- Modify: `mission-site/app/page.tsx`
- Create: `mission-site/tests/mission-page.test.tsx`
- Create: `mission-site/public/videos/mission-01.mp4`

**Interfaces:**
- Consumes: `Mission`, `missionIds`, `getMission`, `sitePath`.
- Produces: `MissionPage({ mission }: { mission: Mission })` and a statically generated `/missions/01/` route.

- [ ] **Step 1: Write the failing presentation test**

Create `tests/mission-page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MissionPage } from "@/components/mission-page";
import { getMission } from "@/lib/missions";

describe("MissionPage", () => {
  it("renders the approved static question structure without answer controls", () => {
    const mission = getMission("01");
    if (!mission) throw new Error("mission 01 missing");
    render(<MissionPage mission={mission} />);

    expect(screen.getByRole("heading", { name: "סימן דרך" })).toBeVisible();
    expect(screen.getByText("שאלה 1")).toBeVisible();
    expect(screen.getByText("באיזו עיר נמצא מגדל אייפל?")).toBeVisible();
    for (const answer of ["פריז", "רומא", "לונדון", "מדריד"]) {
      expect(screen.getByText(answer)).toBeVisible();
    }
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm test -- tests/mission-page.test.tsx
```

Expected: FAIL because `MissionPage` does not exist.

- [ ] **Step 3: Implement the shared page and static route**

Implement `MissionPage` as semantic markup with this order: logo, `h1` page type, question number, `h2` question, ordered list of four answers, then a native `<video controls playsInline preload="metadata">` sourced through `sitePath(mission.videoFile)`. Use `<img>` for the approved logo and plain list items for answers. Task 4 will extract the already-working native element into the dedicated error-aware `VideoPlayer` component.

Implement `app/missions/[id]/page.tsx` with:

```tsx
export const dynamicParams = false;

export function generateStaticParams() {
  return missionIds.map((id) => ({ id }));
}
```

Resolve `params` as a promise, call `getMission`, call `notFound()` for an unknown id, and return `<MissionPage mission={mission} />` for a valid id. `generateMetadata` must set a mission-specific title and `{ index: false, follow: false }`.

Replace the root starter UI in `app/page.tsx` with the same concise not-found surface used by `app/not-found.tsx`; do not link to any mission.

Generate the development MP4:

```powershell
ffmpeg -f lavfi -i "color=c=0x061D4F:s=1280x720:d=2" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an public/videos/mission-01.mp4
```

Style the page in `app/globals.css` as a white mission card with navy/gold angular accents, a subtle dotted route line, a maximum width of `760px`, mobile padding of `16px`, desktop padding of `40px`, and answer rows that are visually decorative but have no hover or focus behavior.

- [ ] **Step 4: Verify GREEN and compile the first slice**

Run:

```powershell
npm test -- tests/mission-page.test.tsx
npm run dev
```

Expected: test PASS; the development server prints a local URL.

- [ ] **Step 5: Complete the first meaningful preview gate**

Request `/missions/01/` once with a non-browser HTTP request and require status 200. Then open that exact route once with the app preview. Make no further planned product-source edits before this handoff.

- [ ] **Step 6: Commit**

```powershell
git add mission-site/app mission-site/components mission-site/public mission-site/tests
git commit -m "feat: render first static mission page"
```

---

### Task 4: Add the resilient native MP4 player

**Files:**
- Create: `mission-site/components/video-player.tsx`
- Modify: `mission-site/components/mission-page.tsx`
- Create: `mission-site/tests/video-player.test.tsx`

**Interfaces:**
- Consumes: `sitePath`, `Mission.videoFile`, and optional `Mission.videoPoster`.
- Produces: `VideoPlayer({ src, poster, title }: { src: string; poster?: string; title: string })`.

- [ ] **Step 1: Write the failing video tests**

Create `tests/video-player.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideoPlayer } from "@/components/video-player";

describe("VideoPlayer", () => {
  it("renders a local inline MP4 with native controls and no autoplay", () => {
    const { container } = render(
      <VideoPlayer src="/videos/mission-01.mp4" title="סרטון משימה 1" />,
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("src", "/videos/mission-01.mp4");
  });

  it("keeps the mission visible and reports a video load error", () => {
    const { container } = render(
      <VideoPlayer src="/videos/missing.mp4" title="סרטון משימה" />,
    );
    fireEvent.error(container.querySelector("video")!);
    expect(screen.getByText("הסרטון עדיין לא זמין")).toBeVisible();
  });
});
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm test -- tests/video-player.test.tsx
```

Expected: FAIL because `VideoPlayer` does not exist.

- [ ] **Step 3: Implement the minimal client component**

Create `components/video-player.tsx` with `"use client"`, one `useState(false)` error flag, and this native element:

```tsx
<video
  aria-label={title}
  controls
  playsInline
  preload="metadata"
  src={sitePath(src)}
  poster={poster ? sitePath(poster) : undefined}
  onError={() => setFailed(true)}
>
  הדפדפן אינו תומך בניגון הסרטון.
</video>
```

When failed, replace the video with `<p role="status">הסרטון עדיין לא זמין</p>`. Render this component below the answers inside `MissionPage`.

- [ ] **Step 4: Verify GREEN**

Run:

```powershell
npm test -- tests/video-player.test.tsx tests/mission-page.test.tsx
```

Expected: both files PASS.

- [ ] **Step 5: Commit**

```powershell
git add mission-site/components mission-site/tests
git commit -m "feat: add local mission video player"
```

---

### Task 5: Enforce video limits and produce GitHub Pages output

**Files:**
- Modify: `mission-site/next.config.ts`
- Modify: `mission-site/package.json`
- Create: `mission-site/scripts/check-video-size.mjs`
- Create: `mission-site/tests/check-video-size.test.mjs`
- Create: `mission-site/app/robots.ts`
- Create: `mission-site/.github/workflows/pages.yml`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_BASE_PATH` and every `public/videos/*.mp4` file.
- Produces: static files under `dist/client/`; a nonzero validation exit when an MP4 is at or above 100MB; GitHub Pages deployment artifacts.

- [ ] **Step 1: Write the failing video-size test**

Export `findOversizedVideos(directory: string, maxBytes: number): string[]` from the future checker and create `tests/check-video-size.test.mjs`:

```js
import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findOversizedVideos } from "../scripts/check-video-size.mjs";

let directory;
afterEach(() => directory && rmSync(directory, { recursive: true, force: true }));

describe("findOversizedVideos", () => {
  it("returns files whose byte size reaches the hard limit", () => {
    directory = mkdtempSync(join(tmpdir(), "mission-videos-"));
    writeFileSync(join(directory, "small.mp4"), Buffer.alloc(9));
    writeFileSync(join(directory, "large.mp4"), Buffer.alloc(10));
    expect(findOversizedVideos(directory, 10)).toEqual(["large.mp4"]);
  });
});
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm test -- tests/check-video-size.test.mjs
```

Expected: FAIL because the checker does not exist.

- [ ] **Step 3: Implement validation and static-export configuration**

Implement `findOversizedVideos` using `readdirSync`, `statSync`, and a case-insensitive `.mp4` filter. The executable path checks `public/videos` with `100 * 1024 * 1024`, prints offending filenames, and sets `process.exitCode = 1` when any are found.

Add scripts:

```json
"check:videos": "node scripts/check-video-size.mjs",
"build:pages": "npm run check:videos && vinext build"
```

Set `next.config.ts` to:

```ts
import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
};

export default nextConfig;
```

Create `app/robots.ts` returning `rules: { userAgent: "*", disallow: "/" }`.

- [ ] **Step 4: Add the GitHub Pages workflow**

Create `.github/workflows/pages.yml` that triggers on pushes to `master` and manual dispatch, grants `pages: write` and `id-token: write`, installs with `npm ci`, derives `NEXT_PUBLIC_BASE_PATH` from `/${{ github.event.repository.name }}`, runs `npm test`, runs `npm run build:pages`, uploads `dist/client`, and deploys with the official Pages actions.

- [ ] **Step 5: Verify GREEN and inspect exported routes**

Run:

```powershell
npm test
$env:NEXT_PUBLIC_BASE_PATH='/mission-site'
npm run build:pages
Test-Path -LiteralPath 'dist/client/missions/01/index.html'
Test-Path -LiteralPath 'dist/client/videos/mission-01.mp4'
Remove-Item Env:NEXT_PUBLIC_BASE_PATH
```

Expected: all tests PASS, build exits 0, and both path checks return `True`.

- [ ] **Step 6: Commit**

```powershell
git add mission-site
git commit -m "feat: export mission pages for GitHub Pages"
```

---

### Task 6: Final validation and user-owned publishing handoff

**Files:**
- Verify only; modify source only for failures proven by the checks below.

**Interfaces:**
- Consumes: the complete static export and the user's authenticated GitHub destination.
- Produces: one public mission URL under the user's GitHub Pages account and a stable path format for future QR codes.

- [ ] **Step 1: Run the complete validation set**

```powershell
Set-Location mission-site
npm test
npm run check:videos
npm run build:pages
```

Expected: zero failed tests; video check and build exit 0.

- [ ] **Step 2: Verify the generated output without browser automation**

Serve `dist/client` with a retained local static server, request `/missions/01/`, and require HTTP 200. Confirm the returned HTML contains `lang="he"`, `dir="rtl"`, `באיזו עיר נמצא מגדל אייפל?`, and a `<video` element.

- [ ] **Step 3: Publish only to a destination controlled by the user**

Use the user's authenticated GitHub repository and enable GitHub Pages through the included workflow. Do not create or publish to an account not controlled by the user. If no authenticated destination exists, stop after the verified static build and request the repository URL.

- [ ] **Step 4: Record the first stable URL pattern**

Read the exact GitHub Pages origin from the completed deployment, append `/missions/01/`, and require an HTTP 200 response. Save that exact published URL for all later QR generation; never construct it from an assumed username or repository name.

- [ ] **Step 5: Preserve the deferred acceptance-letter QR**

Keep the acceptance-letter QR task open until the separate acceptance video and its real landing-page URL exist; do not point it at mission 01.

- [ ] **Step 6: Commit any validation-only corrections**

```powershell
git add mission-site
git commit -m "fix: finalize mission landing page delivery"
```

Skip this commit when validation required no source changes.
