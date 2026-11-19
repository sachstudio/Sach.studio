import { describe, expect, it } from "vitest";
import { caseStudiesTag, caseStudyTag, postTag, postsTag, tagsForCaseStudyChange, tagsForPostChange } from "./tags";

describe("cache tags", () => {
  it("names list and item tags the way the data readers do", () => {
    expect(caseStudiesTag).toBe("case-studies");
    expect(caseStudyTag("a-b")).toBe("case-study:a-b");
    expect(postsTag).toBe("posts");
    expect(postTag("a-b")).toBe("post:a-b");
  });

  it("refreshes the list, the item and the old slug when a case study is renamed", () => {
    expect(tagsForCaseStudyChange("new-slug", "old-slug").sort()).toEqual(
      ["case-studies", "case-study:new-slug", "case-study:old-slug"].sort(),
    );
  });

  it("refreshes only the list and the item when the slug did not change", () => {
    expect(tagsForCaseStudyChange("same")).toEqual(["case-studies", "case-study:same"]);
  });

  it("refreshes post tags the same way", () => {
    expect(tagsForPostChange("p", "q")).toEqual(["posts", "post:p", "post:q"]);
  });
});
