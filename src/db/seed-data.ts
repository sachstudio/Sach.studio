import type { CaseStudyInput, PostInput } from "@/lib/validation";

const img = (name: string) => `/images/projects/${name}`;
const logo = (name: string) => `/images/logos/${name}`;

/** Fields every seeded case study shares, so each entry only states what is specific to it. */
const defaults: Pick<
  CaseStudyInput,
  | "subtitle"
  | "clientName"
  | "clientLogoUrl"
  | "tags"
  | "statusLabel"
  | "displayDate"
  | "heroImageUrl"
  | "figmaUrl"
  | "liveUrl"
  | "about"
  | "bannerImageUrl"
  | "problemIntro"
  | "problems"
  | "solutionIntro"
  | "solutions"
  | "featureImages"
  | "resultsText"
  | "stats"
  | "galleryImages"
  | "conclusion"
  | "metaTitle"
  | "metaDescription"
  | "isFeatured"
  | "status"
  | "isPlaceholder"
> = {
  subtitle: "",
  clientName: "",
  clientLogoUrl: "",
  tags: [],
  statusLabel: null,
  displayDate: null,
  heroImageUrl: "",
  figmaUrl: "",
  liveUrl: "",
  about: "",
  bannerImageUrl: "",
  problemIntro: "",
  problems: [],
  solutionIntro: "",
  solutions: [],
  featureImages: [],
  resultsText: "",
  stats: [],
  galleryImages: [],
  conclusion: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
  status: "published",
  isPlaceholder: false,
};

export const seedCaseStudies: CaseStudyInput[] = [
  {
    ...defaults,
    slug: "hasiru-dala-innovations-website-redesign",
    title: "Hasiru Dala Innovations: Corporate Website & Landing Page Redesign",
    subtitle: "A clean, image-led WordPress website that helps a Bengaluru waste management leader win more B2B clients.",
    clientName: "Hasiru Dala Innovations",
    clientLogoUrl: logo("case-hasiru-dala.png"),
    category: "websites",
    tags: ["Waste Management & Circular Economy", "Bengaluru, India", "UI/UX Design", "WordPress Development"],
    displayDate: "10 Feb 2025",
    heroImageUrl: img("hasiru-dala-hero.webp"),
    cardImageUrl: img("hasiru-dala-card.webp"),
    bannerImageUrl: img("hasiru-dala-banner.webp"),
    about:
      "Hasiru Dala Innovations (HDI) is a Bengaluru-based waste management company and the world’s only multi-stream waste management company that is Fair Trade Guaranteed by the WFTO. Through its Inclusive Circularity® model, HDI turns waste pickers into Green Collar® Professionals and delivers compliant, traceable waste services to corporate offices, institutional campuses, residential communities, events, and brands. Its three core solutions, Total Waste Management, Event Waste Management, and Plastics Circularity, serve 370+ clients across the city.",
    problemIntro:
      "HDI had grown into a professional B2B service provider, but its website still read like a nonprofit. The brief was clear: a modern, corporate website with less text, stronger visuals, and a clear path to enquiry. Our audit found five gaps:",
    problems: [
      { lead: "Brand perception", text: "The site looked NGO-led, not like a reliable corporate service partner." },
      { lead: "Text-heavy pages", text: "Long paragraphs buried key services and proof points." },
      { lead: "Weak conversion paths", text: "Enquiry buttons were hard to find and forms appeared too late." },
      { lead: "Unclear service structure", text: "Three distinct solutions competed on the same pages." },
      { lead: "Inconsistent visuals", text: "Mixed layouts and styles across pages weakened trust." },
    ],
    solutionIntro:
      "We redesigned the website and landing pages around one goal: helping decision-makers understand HDI quickly and get in touch easily.",
    solutions: [
      {
        lead: "Corporate, image-first design",
        text: "Real photography of HDI’s teams and operations now tells the story, with copy cut to what matters.",
      },
      {
        lead: "Conversion-focused UX",
        text: "“Partner With Us” CTAs on every key section, plus a short enquiry form that captures the service needed.",
      },
      {
        lead: "Dedicated solution landing pages",
        text: "Separate pages for Total Waste Management, Event Waste Management, and Plastics Circularity, each built for its own audience.",
      },
      {
        lead: "Unified design system on WordPress",
        text: "Consistent type, colour, and components, built so HDI’s team can update pages without breaking the design.",
      },
    ],
    featureImages: [img("hasiru-dala-feature.webp")],
    resultsText:
      "The new website presents HDI as what it has become: a professional, scalable waste management partner for businesses. Impact numbers, client logos, and testimonials now appear early on the homepage, so trust is built before a visitor scrolls far. Each solution has a focused landing page with a clear next step, which makes the journey from first visit to enquiry shorter and simpler. The site is also structured around the searches HDI’s clients make, such as “waste management company in Bangalore.”",
    stats: [
      { value: "42%", label: "Increased B2B Lead Generation" },
      { value: "180%", label: "Boost in Average Session Duration" },
      { value: "35+", label: "Daily Real-Time Impact Queries" },
    ],
    galleryImages: [img("hasiru-dala-gallery-1.webp"), img("hasiru-dala-gallery-2.webp")],
    conclusion:
      "The Hasiru Dala Innovations redesign shows that a mission-driven brand can look fully corporate without losing its purpose. By leading with visuals, trimming content, and putting enquiry paths everywhere they belong, we gave HDI a website that earns the confidence of corporate clients and helps scale its Inclusive Circularity® model.",
    summary:
      "A corporate WordPress website and landing page redesign for a Bengaluru waste management company, built to turn impact into enquiries.",
    metaTitle: "Hasiru Dala Innovations Website Redesign | Sach Studio",
    metaDescription:
      "How Sach Studio redesigned Hasiru Dala Innovations’ WordPress website and landing pages into a clean, image-led corporate site built to win B2B enquiries.",
    isFeatured: true,
    sortOrder: 10,
  },
  {
    ...defaults,
    slug: "gulf-cv-writers-website-design",
    title: "Gulf CV Writers: Conversion-Focused Website for a Dubai CV Writing Service",
    subtitle: "A trust-first WordPress website that turns job seekers across the UAE and GCC into paying clients.",
    clientName: "Gulf CV Writers",
    clientLogoUrl: logo("case-gulf-cv-writers.png"),
    category: "websites",
    tags: ["Career Services & Professional Writing", "Dubai, UAE & GCC", "UI/UX Design", "WordPress Development"],
    statusLabel: "LIVE",
    displayDate: "10 Feb 2025",
    heroImageUrl: img("gulf-cv-writers-hero.webp"),
    cardImageUrl: img("gulf-cv-writers-card.webp"),
    bannerImageUrl: img("gulf-cv-writers-banner.webp"),
    liveUrl: "",
    about:
      "Gulf CV Writers is a professional CV writing company serving job seekers in Dubai, Abu Dhabi, Riyadh, Doha and across the GCC. With more than 10 years of experience and 2,500+ CVs delivered across 50+ industries, its certified writers create ATS-optimized CVs, cover letters, LinkedIn profiles and job portal profiles for Bayt, Naukrigulf and GulfTalent. Every document is written by hand, with delivery options ranging from four working days down to eight hours.",
    problemIntro:
      "CV writing in Dubai is a crowded, price-sensitive market, and buyers are anxious: they’re paying a service they’ve never met to shape their career. Gulf CV Writers needed a website that earned that trust quickly and made ordering simple. We identified five challenges:",
    problems: [
      { lead: "Trust gap", text: "A fully remote service had to prove its credibility to first-time buyers." },
      { lead: "Price justification", text: "Premium pricing needed clear value next to cheaper, template-based competitors." },
      { lead: "Complex service range", text: "Five services and two bundled packages risked confusing visitors." },
      { lead: "Urgent buyers", text: "Many visitors have an interview soon and need fast answers and fast checkout." },
      { lead: "Competitive search", text: "Ranking for terms like “CV writing Dubai” needed a strong SEO structure." },
    ],
    solutionIntro: "We designed a website that builds confidence first and asks for the order second.",
    solutions: [
      {
        lead: "Proof up front",
        text: "Interview success rate, CVs delivered, industries covered, and employer logos appear right below the hero.",
      },
      {
        lead: "Clear packages and pricing",
        text: "Two bundled packages and individual services, each with prices in AED, inclusions, revisions and delivery time.",
      },
      {
        lead: "Short paths to purchase",
        text: "“Order Now” on every service, direct checkout pages for packages, and WhatsApp support for quick questions.",
      },
      {
        lead: "SEO-ready service pages",
        text: "Dedicated pages for CV writing, resume writing, cover letters, LinkedIn makeovers and job portal optimization, plus a detailed FAQ.",
      },
    ],
    featureImages: [img("gulf-cv-writers-feature.webp")],
    resultsText:
      "The new Gulf CV Writers website makes a remote service feel trustworthy and easy to buy from. Visitors see proof of results before they see prices, so the pricing reads as value rather than cost. Clear package comparisons help job seekers choose the right option without needing to ask, while express delivery options and WhatsApp support serve urgent buyers. Each service now has its own search-optimized page, giving the brand a stronger foundation to compete for high-intent searches across the UAE and GCC.",
    // The design shows the same placeholder numbers (42%, 180%, 35+) on every case study. They are left out
    // here so no client appears with figures that were never measured; add real ones in the admin.
    stats: [],
    galleryImages: [img("gulf-cv-writers-gallery-1.webp"), img("gulf-cv-writers-gallery-2.webp")],
    conclusion:
      "For Gulf CV Writers, the website is the salesperson. By leading with proof, simplifying pricing and shortening the path to checkout, we built a site that helps job seekers across the Gulf trust the brand and order with confidence.",
    summary:
      "A conversion-focused WordPress website for a CV writing company serving job seekers in Dubai, the UAE and the wider GCC.",
    metaTitle: "Gulf CV Writers Website Design & Development | Sach",
    metaDescription:
      "How Sach Studio designed and built a conversion-focused WordPress website for Gulf CV Writers, a CV writing service for job seekers across Dubai and the GCC.",
    isFeatured: true,
    isPlaceholder: true,
    sortOrder: 20,
  },
  {
    ...defaults,
    slug: "master-systems-maritime-automation-website",
    title: "Master Systems: Engineering Digital Trust in Maritime Automation",
    subtitle: "Architecting a High-Density B2B Interface for Global Maritime Operations",
    clientName: "Master Systems",
    clientLogoUrl: logo("case-master-systems.png"),
    category: "websites",
    tags: ["Websites & Landing Pages", "Maritime Technology / B2B Platforms", "World Wide", "Wordpress Website"],
    statusLabel: "ONGOING",
    displayDate: "10 Feb 2025",
    heroImageUrl: img("master-systems-hero.webp"),
    cardImageUrl: img("master-systems-card.webp"),
    bannerImageUrl: img("master-systems-banner.webp"),
    about:
      "Founded in 1999 and headquartered in Dubai, Master Systems is a global leader in marine electronics, automation, and safety solutions. They serve as a critical technical partner for ship owners, managers, and dry docks, specializing in everything from GMDSS radio surveys to complex Ballast Water Treatment Systems (BWTS). With a workforce of 500+ certified technicians, they provide 24/7 support across major global shipping hubs.",
    // PLACEHOLDER: the Figma frame repeats the Hasiru Dala text here, so this is drafted from the
    // Master Systems facts above and the screens in the design. Replace with the real case study.
    problemIntro:
      "Master Systems offers a deep technical range to ship owners, managers and dry docks worldwide, but a visitor had to dig to see it. The website needed to show that depth quickly and make it easy to ask for a quote. We focused on five areas:",
    problems: [
      { lead: "Dense product range", text: "Navigation, communication, safety and automation products needed a clear structure." },
      { lead: "Trust at first glance", text: "Decades of experience and certifications had to be visible early." },
      { lead: "Quote requests", text: "Buyers needed a short route from a product to a quote request." },
      { lead: "Global audience", text: "Locations, support and contacts had to be easy to find for crews and managers." },
      { lead: "Recruitment", text: "Technical roles needed pages that attract certified engineers." },
    ],
    solutionIntro: "We built a high-density but orderly interface around the questions a ship manager asks first.",
    solutions: [
      { lead: "Structured product pages", text: "Key products grouped by solution, with filters and clear next steps." },
      { lead: "Proof near the top", text: "Years of leadership, awards and global locations shown right after the hero." },
      { lead: "Request a quote everywhere", text: "A quote action on product, solution and footer sections." },
      { lead: "Careers and contact", text: "Job listings and an application form alongside the service and support pages." },
    ],
    featureImages: [img("master-systems-feature.webp")],
    resultsText:
      "The new website presents Master Systems as the established global partner it is, with products, proof and support organised for the way maritime buyers search. Replace this paragraph with the measured results once they are available.",
    stats: [],
    galleryImages: [img("master-systems-gallery-1.webp"), img("master-systems-gallery-2.webp")],
    conclusion:
      "Master Systems shows how a technical B2B brand can feel clear and trustworthy online. Replace this paragraph with the final conclusion.",
    summary: "A high-density B2B website for a global marine electronics, automation and safety company.",
    metaTitle: "Master Systems Maritime Website Design | Sach Studio",
    metaDescription:
      "How Sach Studio designed a clear, high-density B2B website for Master Systems, a global leader in marine electronics, automation and safety solutions.",
    isFeatured: true,
    isPlaceholder: true,
    sortOrder: 30,
  },
  {
    ...defaults,
    slug: "cosmion-community-clubhouse-website-design",
    title: "Cosmion Community Clubhouse: Premium Website for a Bengaluru Lifestyle Destination",
    subtitle: "One luxury website for stays, dining, sports, weddings and memberships, built to turn visitors into bookings.",
    clientName: "Cosmion Community Clubhouse",
    clientLogoUrl: logo("cosmion.png"),
    category: "websites",
    tags: ["Hospitality, Leisure & Events", "Yelahanka, Bengaluru, India", "UI/UX Design", "WordPress Development"],
    displayDate: "10 Feb 2025",
    heroImageUrl: img("cosmion-hero.webp"),
    cardImageUrl: img("cosmion-hero.webp"),
    bannerImageUrl: img("cosmion-banner.webp"),
    about:
      "Cosmion Community Clubhouse is a 6-acre lifestyle destination in Yelahanka, North Bengaluru, open to both members and guests. It brings together the Cosmion Family Resort with Deluxe Rooms and Family Suites, three dining venues (Nezo Cafe & Lounge, Nakshatra Multi Cuisine Restaurant and Surahi Bar & Lounge), a sports club with tennis, badminton, football, cricket and swimming, wellness facilities, and wedding and corporate event spaces.",
    problemIntro:
      "Cosmion isn’t one business. It’s a resort, three restaurants, a sports club, a wedding venue and a membership club in one place. The website had to feel like a premium destination while helping each type of visitor find what they came for and act on it. We identified five challenges:",
    problems: [
      {
        lead: "Many audiences, one site",
        text: "Wedding planners, families, sports members, resort guests and corporate teams all needed their own clear path.",
      },
      {
        lead: "Premium positioning",
        text: "The design had to match the quality of the property and stand apart from typical clubhouse websites.",
      },
      {
        lead: "Transparency",
        text: "Visitors wanted clear details on rooms, facilities, memberships and policies before reaching out.",
      },
      {
        lead: "Booking friction",
        text: "Enquiries for stays, events and memberships needed to be fast, especially on mobile.",
      },
      {
        lead: "Local search visibility",
        text: "Each venue and service needed to rank for its own searches in North Bengaluru.",
      },
    ],
    solutionIntro: "We designed a luxury website with a clear structure, where every page leads to a booking or enquiry.",
    solutions: [
      {
        lead: "Premium visual language",
        text: "A refined navy and gold palette, elegant serif typography and large dusk-lit photography give the brand a luxury feel.",
      },
      {
        lead: "Clear structure by experience",
        text: "Stay, Dine, Play and Celebrate each have their own section, with dedicated pages for every room type, restaurant, sport and event format.",
      },
      {
        lead: "Transparent information",
        text: "Room types and counts, facility details, membership information, a downloadable brochure, and visible cancellation and refund policies build trust before the first enquiry.",
      },
      {
        lead: "Frictionless conversion",
        text: "One-tap WhatsApp reservations with pre-filled messages, a sticky call button, “Plan Your Visit” CTAs and a direct member login.",
      },
    ],
    featureImages: [img("cosmion-feature.webp")],
    resultsText:
      "The new website presents Cosmion as a premium destination rather than a collection of separate facilities. Each audience now has a direct path, whether a couple planning a wedding, a family booking a weekend stay or a parent looking for a sports membership. Clear details and visible policies answer common questions before visitors need to ask, and one-tap WhatsApp enquiries turn interest into conversations quickly. With dedicated pages for every venue and service, Cosmion also has a strong foundation to rank for local searches across Yelahanka and North Bengaluru.",
    stats: [],
    galleryImages: [img("cosmion-gallery-1.webp"), img("cosmion-gallery-2.webp")],
    conclusion:
      "Cosmion shows how a multi-venue property can feel like one premium brand. By combining a luxury design language with a clear structure, transparent information and fast WhatsApp-led enquiries, we built a website that does justice to the destination and turns visitors into guests, members and celebrations.",
    summary:
      "A premium WordPress website that brings stays, dining, sports, weddings and memberships at a Bengaluru clubhouse under one brand.",
    metaTitle: "Cosmion Clubhouse Website Design & Development | Sach",
    metaDescription:
      "How Sach Studio designed a premium, conversion-focused WordPress website for Cosmion Community Clubhouse, a 6-acre lifestyle destination in Bengaluru.",
    isPlaceholder: true,
    sortOrder: 50,
  },
  {
    ...defaults,
    slug: "arizona-business-loan-page-design",
    title: "Arizona: Business Loan Page Design Visualisation",
    clientName: "Arizona",
    category: "websites",
    statusLabel: "CONCEPT",
    cardImageUrl: img("arizona-loan-card.webp"),
    summary: "A concept design for a business loan landing page.",
    isFeatured: true,
    isPlaceholder: true,
    sortOrder: 40,
  },
  {
    ...defaults,
    slug: "arizona-investment-management-dashboard",
    title: "Arizona: Investment Management Simplified",
    clientName: "Arizona",
    category: "web-apps-dashboard",
    statusLabel: "CONCEPT",
    displayDate: "10 Feb 2025",
    cardImageUrl: img("arizona-investment-card.webp"),
    summary: "A clear investment management dashboard concept.",
    isPlaceholder: true,
    sortOrder: 60,
  },
  {
    ...defaults,
    slug: "medismart-health-dashboard",
    title: "MediSmart: Health Tracking Dashboard",
    clientName: "MediSmart",
    category: "web-apps-dashboard",
    statusLabel: "CONCEPT",
    displayDate: "10 Feb 2025",
    cardImageUrl: img("medismart-card.webp"),
    summary: "A health tracking dashboard concept with readings, goals and activity in one view.",
    isPlaceholder: true,
    sortOrder: 70,
  },
];

const placeholderBody = (topic: string) =>
  `This is placeholder text so the blog layout can be reviewed. Replace it in the admin with the real article about ${topic}.\n\n## Why it matters\n\nWrite the key idea of the post here, in a few short paragraphs.\n\n## What to do next\n\nClose with a clear takeaway for the reader.`;

export const seedPosts: PostInput[] = [
  {
    slug: "why-design-matters",
    title: "Why Design Matters",
    excerpt: "",
    coverImageUrl: "/images/blogs/wcag-contrast-tools-cover.webp",
    body: placeholderBody("why design matters for a business"),
    displayDate: "5 Mar 2026",
    status: "published",
    sortOrder: 10,
    isPlaceholder: true,
  },
  {
    slug: "use-of-ai",
    title: "Use of AI",
    excerpt: "",
    coverImageUrl: "/images/blogs/master-systems-cover.webp",
    body: placeholderBody("using AI in design and development"),
    displayDate: "5 Mar 2026",
    status: "published",
    sortOrder: 20,
    isPlaceholder: true,
  },
  {
    slug: "importance-of-marketing",
    title: "Importance of Marketing",
    excerpt: "",
    coverImageUrl: "/images/blogs/gulf-cv-writers-cover.webp",
    body: placeholderBody("the importance of marketing"),
    displayDate: "5 Mar 2026",
    status: "published",
    sortOrder: 30,
    isPlaceholder: true,
  },
  {
    slug: "use-of-social-media",
    title: "Use of Social Media",
    excerpt: "",
    coverImageUrl: "/images/blogs/design-process-cover.webp",
    body: placeholderBody("using social media for a brand"),
    displayDate: "5 Mar 2026",
    status: "published",
    sortOrder: 40,
    isPlaceholder: true,
  },
];
