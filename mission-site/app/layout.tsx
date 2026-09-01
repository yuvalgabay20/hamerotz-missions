import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const heebo = localFont({
  src: "../public/fonts/heebo-variable.ttf",
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "המירוץ למיליון — משימה",
  description: "דף משימה אישי",
  openGraph: { images: ["/og.png"] },
  twitter: { images: ["/og.png"] },
  robots: { index: false, follow: false },
};

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
