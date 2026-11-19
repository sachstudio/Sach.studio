export type FaqItem = { id: string; question: string; answer: string };

/**
 * Home FAQ. The first answer is the owner's copy. The other five answers were not in the
 * design files; they are placeholders written from the questions and listed in
 * docs/placeholder-content.md.
 */
export const homeFaqs: FaqItem[] = [
  {
    id: "project-length",
    question: "How Long Does A Project Take?",
    answer:
      "SACH STUDIO offers multiple services including website design, landing pages, mobile apps, web apps, dashboard UI/UX, branding, and marketing systems. Most projects are completed within 1–6 weeks depending on the project scope, revisions, and client feedback timeline. Before starting any project, we clearly communicate the estimated delivery timeline and always aim to deliver on time.",
  },
  {
    id: "design-and-development",
    question: "Do You Provide Both Design And Development Services?",
    answer:
      "Yes. We design and build in one team, so nothing is lost between a design file and a live product. We can also design only, and hand over developer-ready Figma files, if you already have a development team.",
  },
  {
    id: "ongoing-support",
    question: "Do You Offer Ongoing Support And Maintenance Services?",
    answer:
      "Yes. Website projects include limited free support after launch for bug fixes and small adjustments. For ongoing updates, performance checks and new pages, we offer a monthly maintenance plan.",
  },
  {
    id: "get-started",
    question: "How Do I Get Started With SACH STUDIO?",
    answer:
      "Book a 15-minute call using the calendar on this page. We will talk through your goals, scope and timeline, then send a clear proposal. Work begins once the proposal is approved and the first payment is made.",
  },
  {
    id: "not-satisfied",
    question: "What Happens If I’m Not Satisfied With The Final Result?",
    answer:
      "We refine the work until you are satisfied, within the agreed scope and timeline. Tell us what is not working, and we will revise it. Revisions are unlimited while the project is active and before final approval.",
  },
  {
    id: "revision-deadline",
    question: "Why Do Unlimited Revisions Have A Deadline?",
    answer:
      "Unlimited revisions apply during the active project phase so the work keeps moving and your launch date holds. Once a design is approved in writing, further changes are treated as a new request and may be quoted separately.",
  },
];

/** Contact page FAQ. The first answer is the owner's copy; the rest are placeholders. */
export const contactFaqs: FaqItem[] = [
  {
    id: "call-content",
    question: "What Happens During The 15-Minute Consultation Call?",
    answer:
      "During the consultation call, we’ll understand your business, project goals, requirements, and challenges. We’ll also discuss possible solutions, timelines, and how SACH STUDIO can help bring your vision to life.",
  },
  {
    id: "prepare",
    question: "What Should I Prepare Before Booking The Meeting?",
    answer:
      "Nothing formal. It helps to have a rough idea of your goals, any websites or brands you like, your timeline and your budget range. If you have existing designs or content, bring links to them.",
  },
  {
    id: "international",
    question: "Do You Work With International Clients And Different Time Zones?",
    answer:
      "Yes. We work with clients around the world. The booking calendar shows times in your own time zone, and we communicate by email and video call so projects run smoothly across regions.",
  },
  {
    id: "reschedule",
    question: "Can I Reschedule My Booked Consultation Call?",
    answer:
      "Yes. Use the reschedule link in your booking confirmation email to pick a new time, or reply to that email and we will move it for you.",
  },
  {
    id: "after-booking",
    question: "What Happens After I Book The Meeting?",
    answer:
      "You will receive a confirmation email with the meeting link and calendar invite. After the call, we send a short summary with next steps and a proposal if we are a good fit.",
  },
];
