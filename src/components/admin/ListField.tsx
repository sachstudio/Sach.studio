"use client";

import { cn } from "@/lib/cn";

type Item = { lead: string; text: string };

type ListFieldProps = {
  label: string;
  value: Item[];
  onChange: (next: Item[]) => void;
  max?: number;
  error?: string;
};

const input =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500";

const iconButton =
  "flex size-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40";

/** A reorderable list of "bold lead-in + sentence" rows, used for Problems and Solutions. */
export function ListField({ label, value, onChange, max, error }: ListFieldProps) {
  const atMax = max !== undefined && value.length >= max;

  function update(index: number, patch: Partial<Item>) {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium text-neutral-800">{label}</legend>
      {value.length === 0 && <p className="text-sm text-neutral-500">Nothing added yet.</p>}
      <ol className="flex flex-col gap-3">
        {value.map((item, i) => {
          const n = i + 1;
          return (
            <li key={i} className="flex gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="flex flex-1 flex-col gap-2">
                <input
                  aria-label={`${label} ${n} lead-in`}
                  placeholder="Bold lead-in, for example Brand perception"
                  value={item.lead}
                  onChange={(e) => update(i, { lead: e.target.value })}
                  className={input}
                />
                <textarea
                  aria-label={`${label} ${n} sentence`}
                  placeholder="The sentence that follows the lead-in"
                  rows={2}
                  value={item.text}
                  onChange={(e) => update(i, { text: e.target.value })}
                  className={cn(input, "resize-y")}
                />
              </div>
              <div className="flex flex-col gap-1">
                <button type="button" aria-label={`Move ${label} ${n} up`} disabled={i === 0} onClick={() => move(i, -1)} className={iconButton}>
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Move ${label} ${n} down`}
                  disabled={i === value.length - 1}
                  onClick={() => move(i, 1)}
                  className={iconButton}
                >
                  ↓
                </button>
                <button type="button" aria-label={`Remove ${label} ${n}`} onClick={() => onChange(value.filter((_, idx) => idx !== i))} className={iconButton}>
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <div>
        <button
          type="button"
          aria-label={`Add to ${label}`}
          disabled={atMax}
          onClick={() => onChange([...value, { lead: "", text: "" }])}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Add row
        </button>
        {atMax && <span className="ml-3 text-sm text-neutral-500">Maximum of {max} reached</span>}
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}
