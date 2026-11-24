import { describe, expect, it } from "vitest";
import { validatePricingPlan } from "./validation";

const base = { name: "Websites", price: "$2,999" };

describe("validatePricingPlan", () => {
  it("fills in the wording the website used before: Starting from, and the booking button", () => {
    const result = validatePricingPlan(base);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toMatchObject({
        priceLabel: "Starting from",
        ctaLabel: "Book a 15min call",
        ctaHref: "#book-a-call",
        features: [],
        status: "draft",
      });
    }
  });

  it("needs a name and a price", () => {
    const result = validatePricingPlan({ name: " ", price: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["name", "price"]);
  });

  it("drops empty benefit lines and trims the rest", () => {
    const result = validatePricingPlan({ ...base, features: ["  Timeline: 2 Weeks ", "", "   "] });
    expect(result.ok && result.data.features).toEqual(["Timeline: 2 Weeks"]);
  });

  it("allows a page section, a site page or a full web address as the button link, and nothing else", () => {
    for (const ok of ["#book-a-call", "/contact", "https://cal.com/sach/15min"]) {
      expect(validatePricingPlan({ ...base, ctaHref: ok }).ok, ok).toBe(true);
    }
    for (const bad of ["javascript:alert(1)", "//evil.example", "contact", "http://"]) {
      expect(validatePricingPlan({ ...base, ctaHref: bad }).ok, bad).toBe(false);
    }
  });

  it("limits the number of benefits so a card stays readable", () => {
    const result = validatePricingPlan({ ...base, features: Array.from({ length: 13 }, (_, i) => `Benefit ${i}`) });
    expect(result.ok).toBe(false);
  });
});
