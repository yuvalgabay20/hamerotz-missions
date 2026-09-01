import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const heebo = localFont({
  src: "../public/fonts/heebo-variable.ttf",
  variable: "--font-heebo",
  display: "swap",
});

export function createMetadata(
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL,
): Metadata {
  const shared: Metadata = {
    title: "המירוץ למיליון — משימה",
    description: "דף משימה אישי",
    robots: { index: false, follow: false },
  };

  if (!siteUrl) return shared;

  try {
    const publicUrl = new URL(siteUrl);
    const hostname = publicUrl.hostname.toLowerCase();
    if (
      !["http:", "https:"].includes(publicUrl.protocol) ||
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".localhost")
    ) {
      return shared;
    }

    const imageUrl = new URL(
      "og.png",
      `${publicUrl.toString().replace(/\/$/, "")}/`,
    ).toString();
    return {
      ...shared,
      openGraph: { images: [imageUrl] },
      twitter: { images: [imageUrl] },
    };
  } catch {
    return shared;
  }
}

export const metadata = createMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} antialiased`}>{children}</body>
    </html>
  );
}
