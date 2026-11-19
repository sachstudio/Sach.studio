import type { Metadata } from "next";
import { instrumentSerif, outfit } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Sach Studio: Website, App & Dashboard Design and Development",
    template: "%s | Sach Studio",
  },
  description:
    "Sach Studio helps startups, businesses and modern brands launch high-converting digital experiences that look premium, perform fast and scale with confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${outfit.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
