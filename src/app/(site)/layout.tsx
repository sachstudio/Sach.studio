import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Marquee } from "@/components/layout/Marquee";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Sky gradient behind the header and hero, shared by every page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[900px] bg-gradient-to-b from-blue-200 via-blue-50 to-transparent"
      />
      <Header />
      <main className="relative z-10">{children}</main>
      <Marquee />
      <Footer />
    </div>
  );
}
