import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  "use cache";

  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
