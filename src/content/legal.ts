export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] };

export type LegalSection = { heading: string; blocks: LegalBlock[] };

export type LegalDoc = {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

export type LegalSlug = "privacy-policy" | "terms-conditions" | "payment-cancellation";

const p = (text: string): LegalBlock => ({ type: "p", text });
const h = (text: string): LegalBlock => ({ type: "h", text });
const ul = (...items: string[]): LegalBlock => ({ type: "ul", items });
const section = (heading: string, ...blocks: LegalBlock[]): LegalSection => ({ heading, blocks });

const CONTACT = "SACH STUDIO, hi@sach.studio";

export const legalDocs: Record<LegalSlug, LegalDoc> = {
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "Your privacy matters to SACH STUDIO. This Privacy Policy explains how we collect, use, store, and protect your information when you interact with our website, services, and digital platforms.",
    updated: "May 2026",
    sections: [
      section(
        "Introduction",
        p(
          "At SACH STUDIO, we value transparency, privacy, and data security. We are committed to protecting the personal information shared with us by clients, businesses, and website visitors. This Privacy Policy outlines how we collect, use, and safeguard your information when using our website or services.",
        ),
        p(
          "By accessing our website, booking a consultation, or interacting with our services, you agree to the practices described in this Privacy Policy.",
        ),
      ),
      section(
        "1. Information We Collect",
        p("We may collect personal and business information through:"),
        ul(
          "Contact forms",
          "Booking or consultation forms",
          "Newsletter subscriptions",
          "Project inquiries",
          "Client onboarding processes",
          "Communication via email or third-party platforms",
        ),
        p("The information collected may include:"),
        ul(
          "Name",
          "Email address",
          "Phone number",
          "Company or business details",
          "Project requirements",
          "Billing or invoicing information",
          "Communication records",
        ),
      ),
      section(
        "2. How We Use Your Information",
        p("SACH STUDIO uses collected information to:"),
        ul(
          "Respond to inquiries and consultation requests",
          "Manage projects and client communication",
          "Improve website performance and user experience",
          "Send updates, newsletters, or marketing communication",
          "Provide support and maintenance services",
          "Analyze website traffic and visitor behavior",
          "Improve our services and digital experiences",
        ),
        p("Users may unsubscribe from promotional communication at any time."),
      ),
      section(
        "3. Cookies & Tracking Technologies",
        p(
          "Our website uses cookies and tracking technologies to improve user experience and analyze website performance.",
        ),
        p("We may use tools including:"),
        ul("Google Analytics (GA4)", "Google Tag Manager (GTM)", "Meta Pixel", "Cal.com", "CRM and automation tools"),
        p("These tools may collect anonymous usage and behavioral data such as:"),
        ul("Browser type", "Device information", "IP address", "Pages visited", "Session activity"),
        p("Users can manage or disable cookies through their browser settings."),
      ),
      section(
        "4. Third-Party Services",
        p(
          "We may share limited information with trusted third-party services used to operate our business and website, including:",
        ),
        ul(
          "Analytics platforms",
          "CRM systems",
          "Scheduling tools",
          "Email marketing services",
          "Hosting providers",
          "Payment and invoicing platforms",
        ),
        p("These services only receive information necessary to perform their functions."),
      ),
      section(
        "5. Payments & Billing",
        p("SACH STUDIO does not process payments directly through the website."),
        p(
          "Payments are handled externally through invoices, payment links, or secure third-party payment gateways such as Razorpay / Wise / Stripe.",
        ),
      ),
      section(
        "6. Data Storage & Security",
        p(
          "Client and project-related information may be securely stored within our internal CRM and project management systems.",
        ),
        p(
          "We implement reasonable security measures to protect data against unauthorized access, misuse, disclosure, or loss.",
        ),
      ),
      section(
        "7. International Users",
        p(
          "SACH STUDIO works with clients worldwide. By using our website or services, you understand that your information may be processed and stored in India or through international third-party service providers.",
        ),
      ),
      section(
        "8. GDPR & CCPA Rights",
        p("Depending on your location, you may have rights regarding your personal data, including:"),
        ul(
          "Access to your data",
          "Correction of inaccurate information",
          "Request deletion of personal data",
          "Withdraw consent",
          "Opt out of marketing communication",
        ),
        p("To exercise these rights, users can contact us directly."),
      ),
      section(
        "9. Data Retention",
        p("We retain collected information only for as long as necessary to:"),
        ul("Provide services", "Maintain records", "Meet legal obligations", "Improve customer experience"),
      ),
      section(
        "10. Changes To This Privacy Policy",
        p(
          "SACH STUDIO may update this Privacy Policy from time to time. Any updates will be posted on this page with the revised effective date.",
        ),
      ),
      section(
        "11. Contact Information",
        p("For questions related to this Privacy Policy or your personal data, please contact:"),
        p(CONTACT),
      ),
    ],
  },

  "terms-conditions": {
    title: "Terms & Conditions",
    description:
      "These Terms & Conditions outline the rules, responsibilities, and guidelines for using SACH STUDIO’s website, services, and digital platforms.",
    updated: "May 2026",
    sections: [
      section(
        "Introduction",
        p(
          "Welcome to SACH STUDIO. By accessing our website, booking a consultation, or using our services, you agree to comply with the following Terms & Conditions.",
        ),
        p(
          "These terms are designed to ensure transparency, clear communication, and a smooth working relationship between SACH STUDIO and our clients.",
        ),
      ),
      section(
        "1. About SACH STUDIO",
        p("SACH STUDIO is a premium design and development studio based in Bangalore, India, providing services including:"),
        ul(
          "Website Design & Development",
          "Landing Pages",
          "Branding & Identity Design",
          "Web Applications & Dashboards",
          "Mobile App UI/UX Design",
          "Marketing & Digital Design Services",
        ),
      ),
      section(
        "2. Project Scope",
        p("Every project begins with a mutually agreed scope of work, timeline, deliverables, and pricing."),
        p(
          "Any additional features, revisions, or requests outside the agreed scope may require additional timelines or costs.",
        ),
      ),
      section(
        "3. Client Responsibilities",
        p("Clients are responsible for:"),
        ul(
          "Providing accurate project information",
          "Sharing content, assets, and feedback on time",
          "Reviewing deliverables within agreed timelines",
          "Maintaining communication during the project",
        ),
        p("Delays in client feedback or required materials may affect delivery timelines."),
      ),
      section(
        "4. Payments & Invoicing",
        p("Payments are processed externally through invoices or secure payment links."),
        p(
          "Projects may require an upfront deposit before work begins. Remaining balances must be completed according to the agreed payment schedule.",
        ),
        p("Failure to complete payments may result in paused work, delayed delivery, or restricted access to project files."),
      ),
      section(
        "5. Revisions",
        p("SACH STUDIO offers revisions based on the agreed project terms."),
        p(
          "Unlimited revisions apply only within the active project timeline and scope. Excessive or out-of-scope revisions may require additional charges or revised timelines.",
        ),
      ),
      section(
        "6. Intellectual Property",
        p(
          "Upon full payment completion, final approved deliverables become the property of the client unless otherwise agreed.",
        ),
        p(
          "SACH STUDIO reserves the right to showcase completed projects in portfolios, case studies, social media, and marketing materials unless restricted through a written agreement.",
        ),
      ),
      section(
        "7. Third-Party Services & Tools",
        p("Projects may involve third-party platforms or services including:"),
        ul("Framer", "Webflow", "WordPress", "Google Analytics", "CRM systems", "Hosting providers", "Automation tools"),
        p(
          "Clients are responsible for maintaining subscriptions, licenses, or third-party service fees where applicable.",
        ),
      ),
      section(
        "8. Project Timelines",
        p(
          "Estimated timelines are shared before project initiation. While SACH STUDIO aims to deliver projects on time, delays caused by:",
        ),
        ul("late client feedback", "missing assets", "additional revisions", "third-party dependencies"),
        p("may impact the final delivery schedule."),
      ),
      section(
        "9. Cancellation & Refunds",
        p("Project deposits and completed work payments are generally non-refundable once work has started."),
        p("If a project is canceled, clients may be billed for completed work, resources, or hours already invested."),
      ),
      section(
        "10. Limitation of Liability",
        p("SACH STUDIO is not liable for:"),
        ul(
          "business losses",
          "data loss",
          "third-party platform issues",
          "downtime caused by hosting/services",
          "indirect or consequential damages",
        ),
        p("Clients are responsible for maintaining backups and reviewing final deliverables before launch."),
      ),
      section(
        "11. Website Usage",
        p("Users agree not to:"),
        ul(
          "misuse the website",
          "attempt unauthorized access",
          "copy or reproduce content without permission",
          "use the website for unlawful activities",
        ),
        p("All website content, branding, visuals, and materials remain the intellectual property of SACH STUDIO unless stated otherwise."),
      ),
      section(
        "12. Privacy & Data Usage",
        p(
          "By using our website or services, you also agree to our Privacy Policy regarding data collection, cookies, analytics, and communication practices.",
        ),
      ),
      section(
        "13. International Clients",
        p(
          "SACH STUDIO works with clients globally. By working with us, users understand that services, communication, and data processing may occur across different countries and platforms.",
        ),
      ),
      section(
        "14. Changes To Terms",
        p("SACH STUDIO may update these Terms & Conditions at any time. Updated versions will be published on this page."),
      ),
      section(
        "15. Contact Information",
        p("For questions related to these Terms & Conditions, contact:"),
        p(CONTACT),
      ),
    ],
  },

  "payment-cancellation": {
    title: "Payment & Cancellation",
    description:
      "This policy outlines SACH STUDIO’s payment structure, project cancellation terms, revision guidelines, delivery process, and client responsibilities to ensure a transparent and professional working relationship.",
    updated: "May 2026",
    sections: [
      section(
        "Introduction",
        p(
          "At SACH STUDIO, we believe clear communication and transparency are essential for successful collaborations. This Payment & Cancellation Policy explains how payments, revisions, cancellations, project timelines, and deliverables are handled while working with our team.",
        ),
        p("By starting a project with SACH STUDIO, clients agree to the terms outlined below."),
      ),
      section(
        "1. Payment Structure",
        p(
          "SACH STUDIO typically follows one of the following payment structures depending on the project scope and complexity:",
        ),
        h("Standard Payment Structure"),
        ul("50% upfront payment before project initiation", "50% final payment before project handover or launch"),
        h("Milestone-Based Payment Structure"),
        p("For larger or long-term projects, payments may be divided into multiple milestones agreed upon before the project begins."),
        p("Project work will only begin once the initial payment has been received."),
      ),
      section(
        "2. Accepted Payment Methods",
        p("We accept payments through:"),
        ul("Razorpay", "Bank Transfer", "Wise", "PayPal", "UPI (for Indian clients)", "International Wire Transfers"),
        p("International clients may be invoiced in USD or other applicable currencies."),
      ),
      section(
        "3. Non-Refundable Deposits",
        p("All project deposits and upfront payments are generally non-refundable once work has started."),
        p(
          "This policy exists because project planning, research, strategy, resource allocation, and design/development work begin immediately after project confirmation.",
        ),
        p("In rare situations, SACH STUDIO may consider partial refunds based on:"),
        ul("project stage", "completed work", "invested time/resources", "valid cancellation reasons"),
        p(
          "Any approved refund will exclude costs related to completed work, time invested, third-party expenses, or reserved resources.",
        ),
      ),
      section(
        "4. Project Cancellation",
        p("If a client decides to cancel the project after work has already started:"),
        ul(
          "previously completed payments will not be refunded",
          "completed work remains the property of SACH STUDIO until full payment is cleared",
          "the project may be placed on hold for future continuation",
        ),
        p("Clients may choose to resume the project later depending on team availability, active workload, and revised timelines."),
      ),
      section(
        "5. Project Hold & Inactive Status",
        p("Timely communication and feedback are important to keep projects moving smoothly."),
        p("If a client becomes non-responsive:"),
        ul(
          "SACH STUDIO will attempt communication through multiple channels",
          "after 10 days of inactivity, the project may be marked as inactive",
          "inactive projects may be paused indefinitely until the client responds",
        ),
        p("Once resumed, timelines and availability may change depending on current workloads and scheduling."),
      ),
      section(
        "6. Client Delays & Additional Charges",
        p("Project timelines depend heavily on timely:"),
        ul("feedback", "approvals", "content submission", "communication"),
        p("If delays are caused by the client side and significantly impact delivery schedules, SACH STUDIO reserves the right to:"),
        ul("revise timelines", "pause the project", "apply additional continuation or management fees"),
        p("Our team always aims to deliver projects within the agreed timeline whenever collaboration remains smooth and active."),
      ),
      section(
        "7. Revisions Policy",
        p("SACH STUDIO offers revisions within the agreed project scope and timeline."),
        h("Unlimited Revisions Policy"),
        p("Unlimited revisions apply only:"),
        ul("during the active project phase", "within the approved scope", "before final approval is given"),
        p("Once a design, page, or deliverable has been officially approved by the client through email or written confirmation:"),
        ul("additional changes may be treated as a new request", "extra revisions may involve additional charges"),
        p("Excessive revisions outside the agreed scope may also result in revised timelines or pricing."),
      ),
      section(
        "8. Scope Changes & Additional Requests",
        p("Any additional work outside the original agreed scope may involve:"),
        ul("additional pricing", "revised timelines", "separate quotations"),
        p("Examples include:"),
        ul(
          "additional pages",
          "new features",
          "urgent delivery requests",
          "advanced integrations",
          "redesign requests after approval",
          "additional animations or custom development",
        ),
        p("All scope changes will be communicated clearly before proceeding."),
      ),
      section(
        "9. Ownership & Source Files",
        p(
          "All designs, source files, project assets, credentials, and deliverables remain the property of SACH STUDIO until the full project payment is completed.",
        ),
        p("Upon full payment:"),
        ul("final approved files", "source files (if included)", "credentials", "project assets"),
        p("will be handed over to the client."),
        p(
          "If a client chooses to stop the project midway and requests partial files or work completed so far, SACH STUDIO may issue an invoice based on:",
        ),
        ul("completed work", "invested hours", "resources utilized", "current project progress"),
        p("Files will only be shared after payment clearance."),
      ),
      section(
        "10. Late Payments",
        p("Delayed payments may result in:"),
        ul("paused work", "delayed delivery", "restricted file access", "postponed launch schedules"),
        p("SACH STUDIO reserves the right to withhold final deliverables until pending balances are cleared."),
      ),
      section(
        "11. Post-Launch Support",
        p("SACH STUDIO provides limited complimentary post-launch support depending on the project type."),
        p("For website-related projects:"),
        ul("free support may range between 15–30 days after launch"),
        p("This may include:"),
        ul("bug fixes", "minor adjustments", "launch assistance"),
        p("Ongoing maintenance, updates, or long-term support may require a recurring monthly maintenance plan."),
      ),
      section(
        "12. Third-Party Services & Subscriptions",
        p("Projects may involve third-party tools, platforms, or services including:"),
        ul("Framer", "Webflow", "WordPress", "Hosting providers", "Premium plugins", "APIs", "Automation tools", "CRM systems"),
        p(
          "Clients are responsible for maintaining active subscriptions, licenses, hosting fees, or third-party costs unless otherwise agreed.",
        ),
      ),
      section(
        "13. Project Delivery",
        p("Final project delivery will only occur after:"),
        ul("project approval", "completion of pending revisions", "full payment clearance"),
        p("SACH STUDIO is not responsible for delays caused by:"),
        ul("late feedback", "missing client content", "third-party service issues", "external dependencies"),
      ),
      section(
        "14. Limitation of Liability",
        p("SACH STUDIO is not liable for:"),
        ul(
          "business losses",
          "revenue loss",
          "hosting/server failures",
          "third-party software issues",
          "client-side misuse",
          "downtime caused by external services",
        ),
        p("Clients are responsible for reviewing and approving all final deliverables before launch."),
      ),
      section(
        "15. International Clients",
        p("SACH STUDIO works with clients globally. International clients are responsible for:"),
        ul("local taxes", "transfer fees", "currency conversion fees", "banking charges"),
        p("where applicable."),
      ),
      section(
        "16. Policy Updates",
        p("SACH STUDIO reserves the right to update or modify this policy at any time. Updated versions will be published on this page."),
      ),
      section(
        "17. Contact Information",
        p("For payment, cancellation, or billing-related questions, contact:"),
        p(CONTACT),
      ),
    ],
  },
};
