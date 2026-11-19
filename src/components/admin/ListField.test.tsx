import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ListField } from "./ListField";

type Item = { lead: string; text: string };

function Harness({ initial, max }: { initial: Item[]; max?: number }) {
  const [value, setValue] = useState<Item[]>(initial);
  return (
    <>
      <ListField label="Problems" value={value} onChange={setValue} max={max} />
      <output data-testid="leads">{value.map((v) => v.lead).join("|")}</output>
    </>
  );
}

describe("ListField", () => {
  it("adds a blank row with the Add button", async () => {
    render(<Harness initial={[{ lead: "A", text: "a" }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Add to Problems" }));
    expect(screen.getAllByLabelText(/Problems \d+ lead-in/)).toHaveLength(2);
    expect(screen.getByTestId("leads")).toHaveTextContent("A|");
  });

  it("moves a row down and up", async () => {
    render(
      <Harness
        initial={[
          { lead: "First", text: "1" },
          { lead: "Second", text: "2" },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Move Problems 1 down" }));
    expect(screen.getByTestId("leads")).toHaveTextContent("Second|First");
    await userEvent.click(screen.getByRole("button", { name: "Move Problems 1 down" }));
    expect(screen.getByTestId("leads")).toHaveTextContent("First|Second");
    await userEvent.click(screen.getByRole("button", { name: "Move Problems 2 up" }));
    expect(screen.getByTestId("leads")).toHaveTextContent("Second|First");
  });

  it("disables the first row's Move up and the last row's Move down", () => {
    render(
      <Harness
        initial={[
          { lead: "First", text: "1" },
          { lead: "Second", text: "2" },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Move Problems 1 up" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move Problems 2 down" })).toBeDisabled();
  });

  it("removes a row", async () => {
    render(
      <Harness
        initial={[
          { lead: "First", text: "1" },
          { lead: "Second", text: "2" },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove Problems 1" }));
    expect(screen.getByTestId("leads")).toHaveTextContent("Second");
    expect(screen.getAllByLabelText(/Problems \d+ lead-in/)).toHaveLength(1);
  });

  it("disables Add once the maximum is reached", () => {
    render(<Harness initial={[{ lead: "A", text: "a" }, { lead: "B", text: "b" }]} max={2} />);
    expect(screen.getByRole("button", { name: "Add to Problems" })).toBeDisabled();
  });

  it("edits a row's lead-in and sentence", async () => {
    render(<Harness initial={[{ lead: "", text: "" }]} />);
    await userEvent.type(screen.getByLabelText("Problems 1 lead-in"), "Slow");
    await userEvent.type(screen.getByLabelText("Problems 1 sentence"), "It was slow.");
    expect(screen.getByTestId("leads")).toHaveTextContent("Slow");
  });
});
