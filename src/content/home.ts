export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  tag: string;
  quote: string;
  /** Cropped avatar pair from the Figma design; the rest fall back to initials. */
  avatar?: string;
};

export const home = {
  hero: {
    badge: "Accepting new projects",
    title: "We Build High-Performing",
    accent: "Mobile App, Web App & Dashboards",
    subtitle:
      "Sach Studio helps startups, businesses, and modern brands launch high-converting digital experiences that look premium, perform fast, and scale with confidence.",
  },
  stats: [
    { value: "8+", label: "Years of Experience" },
    { value: "100+", label: "Websites Built" },
    { value: "10+", label: "Experts in Team" },
  ],
  trustedBy: "Trusted by startups, founders & growing their businesses worldwide with SACH STUDIO",
  clientLogos: [
    { name: "Gulf CV Writers", src: "/images/logos/gulf-cv-writers.png", width: 200, height: 90 },
    { name: "Hasiru Dala Innovations", src: "/images/logos/hasiru-dala.png", width: 210, height: 90 },
    { name: "Master Systems", src: "/images/logos/master-systems.png", width: 170, height: 90 },
  ],
  work: {
    title: "Proven Results in Action",
    subtitle:
      "Every project is crafted with strategy, performance, and user experience in mind - helping brands stand out in competitive markets.",
  },
  process: {
    title: "How We Work With You",
    subtitle:
      "We work closely with you through every stage - from planning and design to development and launch - ensuring a smooth and stress-free experience.",
    steps: [
      {
        label: "Step 1",
        duration: "1-2 Days",
        title: "The Discovery Phase",
        text: "We understand your business, goals, audience, and positioning.",
        image: "/images/process/step-1.png",
      },
      {
        label: "Step 2",
        duration: "30 - 45 Days",
        title: "Design & Development",
        text: "We structure the website around clarity, conversion, and user experience.",
        image: "/images/process/step-2.png",
      },
      {
        label: "Step 3",
        duration: "5-10 Days",
        title: "Review & Deployment",
        text: "Testing, optimization, & launch support to ensure everything runs smoothly.",
        image: "/images/process/step-3.png",
      },
    ],
  },
  pricing: {
    title: "Flexible Pricing Plan",
    subtitle:
      "Transparent pricing for startups, founders, and modern businesses that value quality, speed, and real results - while Sach Studio handles the entire process smoothly for you.",
    plans: [
      {
        id: "logo-branding",
        name: "Logo & Branding",
        description:
          "We design logos and brand identities that help businesses look more professional, memorable, and trusted.",
        price: "$1,999",
        features: [
          "Timeline: 2 Weeks",
          "Unlimited Revisions",
          "Logo & Brand Identity",
          "Brand Assets",
          "Company Profile",
          "Marketing Collateral",
          "Pitch Deck Design",
        ],
      },
      {
        id: "websites",
        name: "Websites & Landing Pages",
        description:
          "We create high-performing websites and landing pages - from strategy and design to full development.",
        price: "$2,999",
        features: [
          "Timeline: 2 - 6 Weeks",
          "Unlimited Revisions",
          "Development (Framer, Webflow, Nextjs, Reactjs, Wordpress)",
          "Animations (Rive, After Effects)",
          "Responsive Development",
          "High SEO-Friendly Structure",
          "Tools Integration",
        ],
      },
      {
        id: "mobile-app",
        name: "Mobile App Design",
        description:
          "Modern iOS and Android app designs crafted for usability, performance, and seamless user experience.",
        price: "$3,999",
        features: [
          "Timeline: 2–6 Weeks",
          "Unlimited Revisions",
          "iOS & Android Design",
          "Simple Screens: $150/screen",
          "Complex Screens: $250/screen",
          "Developer-Ready Figma Files",
        ],
      },
      {
        id: "web-app-dashboard",
        name: "Web App & Dashboard UI",
        description:
          "We create user-friendly web apps and dashboard experiences that are clean, scalable, and easy to use.",
        price: "$3,999",
        features: [
          "Timeline: 2–6 Weeks",
          "Unlimited Revisions",
          "iOS & Android Design",
          "Simple Screens: $200/screen",
          "Complex Screens: $400/screen",
          "Developer-Ready Figma Files",
        ],
      },
    ] satisfies PricingPlan[],
  },
  whyUs: {
    title: "Why you will love us?",
    subtitle:
      "We don't just hand over a design file and disappear. We provide the full-stack infrastructure your business needs to scale.",
    painPoints: [
      "Low website conversion?",
      "High bounce rates?",
      "Weak brand identity?",
      "Stagnant growth?",
      "Manual, slow workflows?",
      "Messy data tracking?",
    ],
    designNeeds: ["Logos", "Branding", "Graphics", "Motion", "UI/UX", "3D"],
    tools: [
      "Framer",
      "Webflow",
      "React",
      "Next.js",
      "WordPress",
      "Shopify",
      "Elementor",
      "Figma",
      "GSAP",
      "Vue",
      "Svelte",
      "Tailwind",
    ],
    cards: {
      conversion: {
        title: "Conversion Focus",
        text: "We redesign and optimize digital experiences to help businesses improve conversions, engagement, and overall online performance.",
      },
      integrations: {
        title: "Free Tool Integrations",
        text: "From GA4 and GTM to WhatsApp and CRM systems, we integrate the essential tools your business needs - all included within the project cost, no additional fees.",
      },
      team: {
        title: "All Design Needs, One Team",
        text: "From branding and graphics to motion design and UI/UX, our team handles everything you need without requiring multiple freelancers or agencies.",
      },
      standOut: {
        title: "Stand Out From Competitors",
        text: "We create premium digital experiences that help businesses look more modern, trustworthy, and memorable in competitive markets.",
      },
      tools: {
        title: "Modern Tools & Technologies",
        text: "We use all modern platforms, frameworks, and workflows to build scalable digital experiences tailored to your business needs.",
      },
    },
  },
  testimonialsIntro: {
    title: "What Our Clients Say About Us",
    subtitle:
      "Real feedback from startups, founders, and businesses we’ve helped through premium design and development.",
  },
  testimonials: [
    {
      id: "emily-carter",
      name: "Emily Carter",
      role: "Founder, SaaS Startup",
      tag: "Website & Landing Pages",
      quote:
        "“Sach Studio completely changed how people perceived our business online. Within the first month after launch, our landing page conversion rate improved by around 32%, and visitors were spending noticeably more time on the website. The process also felt extremely smooth compared to previous agencies we worked with.”",
      avatar: "/images/testimonials/avatar-1.png",
    },
    {
      id: "daniel-brooks",
      name: "Daniel Brooks",
      role: "Founder, Tech Startup",
      tag: "Logo, Branding & Marketing Collaterals",
      quote:
        "“The branding work felt very strategic instead of just visually attractive. From logo design to pitch deck assets and social creatives, everything finally looked consistent. It genuinely helped us look more credible while pitching to investors and clients.”",
      avatar: "/images/testimonials/avatar-2.png",
    },
    {
      id: "sophia-martinez",
      name: "Sophia Martinez",
      role: "Marketing Lead, E-commerce Brand",
      tag: "Website & Landing Pages",
      quote:
        "“We were struggling with high bounce rates and poor engagement on our old website. Sach Studio redesigned the entire experience, simplified the user flow, and improved the loading speed significantly. We started receiving better-quality leads within weeks.”",
    },
    {
      id: "emma-wilson",
      name: "Emma Wilson",
      role: "Director, Digital Agency",
      tag: "Logo, Branding & Marketing Collaterals",
      quote:
        "“We originally hired Sach Studio for a logo refresh, but ended up rebranding the entire company with them. The visual direction, typography, and marketing assets gave our business a much more premium identity almost immediately.”",
    },
    {
      id: "arjun-patel",
      name: "Arjun Patel",
      role: "Product Manager, Fintech Platform",
      tag: "Web App & Dashboard UI/UX",
      quote:
        "“Our dashboard was previously difficult to navigate and visually outdated. Sach Studio redesigned the entire interface with a much cleaner UX structure, and our support requests related to navigation dropped noticeably after launch.”",
    },
    {
      id: "michael-carter",
      name: "Michael Carter",
      role: "Founder, AI Automation Company",
      tag: "Strategy & Consultation",
      quote:
        "“What stood out was how deeply they understood the business side of the project. They weren’t just making things look good — they helped us rethink the structure, messaging, and conversion flow of the entire website.”",
    },
  ] satisfies Testimonial[],
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Have questions? Here are some quick answers to help you understand how we work.",
  },
};
