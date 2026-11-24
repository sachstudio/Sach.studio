import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { SachWatermark } from "./SachWatermark";

/** Below lg, and on any touch screen, every footer link gets a 44px tap area; a mouse on desktop keeps the compact spacing. */
const linkTap = "inline-flex items-center max-lg:min-h-11 max-lg:min-w-11 pointer-coarse:min-h-11 pointer-coarse:min-w-11";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-blue-100 to-[#6aa6fb] px-4 pt-16 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-12">
          <div className="flex flex-col gap-5">
            <Image
              src="/brand/sach-studio-logo.svg"
              alt="Sach Studio"
              width={180}
              height={50}
              unoptimized
              className="h-[50px] w-auto self-start"
            />
            <p className="-mt-3 text-base text-neutral-600">{site.tagline}</p>
            <div className="flex flex-wrap gap-x-10 gap-y-0 font-serif text-2xl text-blue-500 sm:text-[26px] lg:gap-y-2">
              <a href={`mailto:${site.email}`} className={`${linkTap} break-all hover:text-blue-700`}>
                {site.email}
              </a>
              <a href={site.phoneHref} className={`${linkTap} hover:text-blue-700`}>
                {site.phone}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[15px] font-medium text-neutral-900 sm:gap-x-24 md:gap-x-16 lg:gap-x-28">
            <ul className="flex flex-col gap-0 lg:gap-3.5">
              {site.footerLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={`${linkTap} hover:text-blue-500`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-0 lg:gap-3.5">
              {site.social.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={`${linkTap} hover:text-blue-500`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stacked on phones and tablets (three columns do not fit legal links and the copyright at 768px). */}
        <div className="mt-10 flex flex-col gap-1 text-xs text-neutral-800 sm:mt-14 lg:grid lg:grid-cols-3 lg:items-center lg:gap-4 lg:text-neutral-600">
          <ul className="flex flex-wrap gap-x-5 gap-y-0 lg:gap-y-2">
            {site.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`${linkTap} hover:text-blue-600`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-1.5 py-2 lg:justify-center lg:py-0">
            Built By
            <svg aria-label="love" role="img" viewBox="0 0 24 24" className="size-3.5 text-blue-500" fill="currentColor">
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2 0 3.4 1 4.3 2.4h3.4C14.6 6 16 5 18 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21Z" />
            </svg>
            Sach.Studio
          </p>
          <p className="uppercase lg:text-right">© 2026 SACH STUDIO. ALL RIGHTS RESERVED.</p>
        </div>

        <SachWatermark className="mt-8 block h-auto w-full text-white/35 sm:mt-14" />
      </div>
    </footer>
  );
}
