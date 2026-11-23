"use client";

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";

type Item = { lead: string; text: string };

type ListFieldProps = {
  label: string;
  value: Item[];
  onChange: (next: Item[]) => void;
  max?: number;
  error?: string;
};

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
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      {value.length === 0 && <p className="text-sm text-muted-foreground">Nothing added yet.</p>}
      <ol className="flex flex-col gap-3">
        {value.map((item, i) => {
          const n = i + 1;
          return (
            <li key={i} className="flex gap-3 rounded-lg border bg-muted/40 p-3">
              <div className="flex flex-1 flex-col gap-2">
                <Input
                  aria-label={`${label} ${n} lead-in`}
                  placeholder="Bold lead-in, for example Brand perception"
                  value={item.lead}
                  onChange={(e) => update(i, { lead: e.target.value })}
                  className="bg-background"
                />
                <Textarea
                  aria-label={`${label} ${n} sentence`}
                  placeholder="The sentence that follows the lead-in"
                  rows={2}
                  value={item.text}
                  onChange={(e) => update(i, { text: e.target.value })}
                  className="min-h-0 resize-y bg-background"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Button type="button" variant="outline" size="icon-sm" aria-label={`Move ${label} ${n} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Move ${label} ${n} down`}
                  disabled={i === value.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Remove ${label} ${n}`}
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                  className="text-destructive hover:text-destructive"
                >
                  <X />
                </Button>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" aria-label={`Add to ${label}`} disabled={atMax} onClick={() => onChange([...value, { lead: "", text: "" }])}>
          <Plus /> Add row
        </Button>
        {atMax && <span className="text-sm text-muted-foreground">Maximum of {max} reached</span>}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
