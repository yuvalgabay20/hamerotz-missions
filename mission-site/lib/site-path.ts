export function sitePath(
  pathname: string,
  basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "",
) {
  const cleanBase = basePath.replace(/\/$/, "");
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${cleanBase}${cleanPath}`;
}
