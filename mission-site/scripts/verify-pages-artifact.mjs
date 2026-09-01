import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

function normalizeBasePath(basePath) {
  const segments = basePath.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error(`Invalid GitHub Pages base path: ${basePath}`);
  }
  return segments.length === 0 ? "" : `/${segments.join("/")}`;
}

function artifactFile(clientDirectory, requestPath, basePath) {
  const mountPath = normalizeBasePath(basePath);
  if (
    mountPath &&
    requestPath !== mountPath &&
    !requestPath.startsWith(`${mountPath}/`)
  ) {
    return undefined;
  }

  const pathname = requestPath.slice(mountPath.length) || "/";
  const relativePath = pathname.endsWith("/")
    ? `${pathname.slice(1)}index.html`
    : pathname.slice(1);
  const root = resolve(clientDirectory);
  const candidate = resolve(root, relativePath);
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) {
    return undefined;
  }
  if (!existsSync(candidate) || !statSync(candidate).isFile()) {
    return undefined;
  }
  return candidate;
}

function contentType(pathname) {
  return extname(pathname).toLowerCase() === ".html"
    ? "text/html; charset=utf-8"
    : "application/octet-stream";
}

function createStaticHandler(clientDirectory, basePath) {
  return (request, response) => {
    const requestPath = decodeURIComponent(
      new URL(request.url ?? "/", "http://127.0.0.1").pathname,
    );
    const requestedFile = artifactFile(clientDirectory, requestPath, basePath);
    const file = requestedFile ?? join(clientDirectory, "404.html");
    const status = requestedFile ? 200 : 404;

    if (!existsSync(file)) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("404");
      return;
    }

    response.writeHead(status, { "content-type": contentType(file) });
    response.end(readFileSync(file));
  };
}

export async function probeMissingPage(clientDirectory, basePath) {
  const server = createServer(createStaticHandler(clientDirectory, basePath));
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });

  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Static artifact server did not expose a TCP port.");
    }
    const mountPath = normalizeBasePath(basePath);
    const response = await fetch(
      `http://127.0.0.1:${address.port}${mountPath}/__missing__/`,
    );
    return { status: response.status, body: await response.text() };
  } finally {
    await new Promise((resolveClose, rejectClose) => {
      server.close((error) => (error ? rejectClose(error) : resolveClose()));
    });
  }
}

function socialImages(html) {
  const images = new Map();
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1];
    const value = tag.match(/content=["']([^"']+)["']/i)?.[1];
    if ((key === "og:image" || key === "twitter:image") && value) {
      images.set(key, value);
    }
  }
  return images;
}

export async function verifyPagesArtifact(
  clientDirectory,
  basePath,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL,
) {
  const probe = await probeMissingPage(clientDirectory, basePath);
  if (probe.status !== 404) {
    throw new Error(`Missing route returned HTTP ${probe.status}, expected 404.`);
  }
  if (!probe.body.includes("המשימה לא נמצאה")) {
    throw new Error("The Pages 404 artifact is missing the approved Hebrew surface.");
  }
  if (!/<html\b[^>]*\bdir=["']rtl["']/i.test(probe.body)) {
    throw new Error("The Pages 404 artifact is not RTL.");
  }

  const missionFile = join(clientDirectory, "missions", "01", "index.html");
  const rootFile = join(clientDirectory, "index.html");
  if (!existsSync(missionFile)) {
    throw new Error("The exported mission 01 artifact is missing.");
  }
  if (!existsSync(rootFile)) {
    throw new Error("The exported root artifact is missing.");
  }
  const missionHtml = readFileSync(missionFile, "utf8");
  const rootHtml = readFileSync(rootFile, "utf8");
  const htmlDocuments = [rootHtml, probe.body, missionHtml];
  const artifactHtml = htmlDocuments.join("\n");
  if (/localhost/i.test(artifactHtml)) {
    throw new Error("The Pages artifact leaks localhost metadata.");
  }

  const imageSets = htmlDocuments.map(socialImages);
  if (!siteUrl) {
    if (imageSets.some((images) => images.size > 0)) {
      throw new Error("Social image metadata must be omitted without a site URL.");
    }
    return;
  }

  const expectedImage = new URL(
    "og.png",
    `${siteUrl.replace(/\/$/, "")}/`,
  ).toString();
  for (const images of imageSets) {
    for (const key of ["og:image", "twitter:image"]) {
      if (images.get(key) !== expectedImage) {
        throw new Error(`${key} must equal ${expectedImage}.`);
      }
    }
  }
}

const scriptPath = fileURLToPath(import.meta.url);

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const projectRoot = join(dirname(scriptPath), "..");
  await verifyPagesArtifact(
    join(projectRoot, "dist", "client"),
    process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  );
  console.log("Pages artifact verified: mounted 404, RTL, and social metadata.");
}
