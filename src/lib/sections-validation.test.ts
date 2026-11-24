import { describe, expect, it } from "vitest";
import { validateFaq, validateTestimonial } from "./validation";

describe("validateFaq", () => {
  const base = { question: "How long does it take?", answer: "About two weeks." };

  it("shows a new FAQ on the home page and keeps it hidden until published", () => {
    const result = validateFaq(base);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toMatchObject({ pages: ["home"], status: "draft", sortOrder: 100 });
  });

  it("needs a question and an answer", () => {
    const result = validateFaq({ question: " ", answer: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["answer", "question"]);
  });

  it("needs at least one page to show on, and only pages that exist", () => {
    const none = validateFaq({ ...base, pages: [] });
    expect(!none.ok && none.errors.pages).toMatch(/at least one page/i);
    const unknown = validateFaq({ ...base, pages: ["pricing"] });
    expect(unknown.ok).toBe(false);
  });

  it("accepts both pages, once each", () => {
    const result = validateFaq({ ...base, pages: ["contact", "home", "home"] });
    expect(result.ok && result.data.pages).toEqual(["contact", "home"]);
  });
});

describe("validateTestimonial", () => {
  const base = { name: "Emily Carter", quote: "Great work." };

  it("needs a name and a quote", () => {
    const result = validateTestimonial({ name: "", quote: " " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["name", "quote"]);
  });

  it("keeps role, tag and photo optional, and starts hidden", () => {
    const result = validateTestimonial(base);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toMatchObject({ role: "", tag: "", avatarUrl: "", status: "draft", sortOrder: 100 });
  });

  it("only takes a photo that is uploaded here or lives on this site", () => {
    expect(validateTestimonial({ ...base, avatarUrl: "/images/testimonials/avatar-1.png" }).ok).toBe(true);
    const outside = validateTestimonial({ ...base, avatarUrl: "https://example.com/me.png" });
    expect(!outside.ok && outside.errors.avatarUrl).toBeTruthy();
  });
});
