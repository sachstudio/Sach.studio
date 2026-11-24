"use client";

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";

type Props = { label: string; value: string[]; onChange: (next: string[]) => void; max?: number; error?: string };

/** A reorderable list of single-line texts, used for the benefits on a pricing card. */
export function BenefitsField({ label, value, onChange, max, error }: Props) {
  const atMax = max !== undefined && value.length >= max;

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
      <ol className="flex flex-col gap-2">
        {value.map((item, i) => {
          const n = i + 1;
          return (
            <li key={i} className="flex items-center gap-2">
              <Input
                aria-label={`${label} ${n}`}
                placeholder="For example Unlimited Revisions"
                value={item}
                onChange={(e) => onChange(value.map((v, idx) => (idx === i ? e.target.value : v)))}
              />
              <Button type="button" variant="outline" size="icon-sm" aria-label={`Move ${label} ${n} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp />
              </Button>
              <Button type="button" variant="outline" size="icon-sm" aria-label={`Move ${label} ${n} down`} disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={`Remove ${label} ${n}`}
                className="text-destructive hover:text-destructive"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              >
                <X />
              </Button>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" disabled={atMax} onClick={() => onChange([...value, ""])}>
          <Plus /> Add benefit
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
