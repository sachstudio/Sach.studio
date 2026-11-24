import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Faq } from "./Faq";

const items = [
  { id: "a", question: "How long does a project take?", answer: "One to six weeks." },
  { id: "b", question: "Can I reschedule?", answer: "Yes, any time." },
];

describe("Faq", () => {
  it("shows the heading and every question it is given", () => {
    render(<Faq title="Frequently Asked Questions" subtitle="Quick answers." items={items} />);
    expect(screen.getByRole("heading", { name: "Frequently Asked Questions" })).toBeInTheDocument();
    expect(screen.getByText("How long does a project take?")).toBeInTheDocument();
    expect(screen.getByText("Can I reschedule?")).toBeInTheDocument();
  });

  it("works in the stacked layout of the contact page too", () => {
    render(<Faq title="FAQ" subtitle="Quick answers." items={items} layout="stacked" />);
    expect(screen.getByText("Can I reschedule?")).toBeInTheDocument();
  });

  it("shows no empty FAQ section when a page has none switched on", () => {
    const { container } = render(<Faq title="FAQ" subtitle="Quick answers." items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
