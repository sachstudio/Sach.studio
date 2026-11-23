"use client";

import { cn } from "cn";
import { useId, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { NativeSelect } from "@/components/admin/ui/native-select";
import { Textarea } from "@/components/admin/ui/textarea";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
  /** Adds the red asterisk the demo uses for required fields. */
  required?: boolean;
};

function FieldShell({ label, hint, error, htmlFor, children, className, required }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1">
        <Label htmlFor={htmlFor}>{label}</Label>
        {required && (
          <span aria-hidden="true" className="text-sm leading-none font-medium text-destructive">
            *
          </span>
        )}
      </div>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function CharacterCount({ length, max }: { length: number; max: number }) {
  return (
    <p className={cn("text-xs tabular-nums", length > max ? "font-medium text-destructive" : "text-muted-foreground")}>
      {length} / {max} characters
    </p>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
  /** Shows "n / max" and warns when over the limit. */
  max?: number;
  required?: boolean;
};

export function TextField({ label, value, onChange, error, hint, placeholder, className, max, required }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={id} className={className} required={required}>
      <Input id={id} value={value} placeholder={placeholder} aria-invalid={Boolean(error)} onChange={(e) => onChange(e.target.value)} />
      {max !== undefined && <CharacterCount length={value.length} max={max} />}
    </FieldShell>
  );
}

type TextAreaProps = Omit<TextFieldProps, "placeholder"> & { rows?: number; placeholder?: string; mono?: boolean };

export function TextArea({ label, value, onChange, error, hint, rows = 4, className, max, placeholder, mono }: TextAreaProps) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
        className={cn("min-h-0 resize-y", mono && "font-mono")}
      />
      {max !== undefined && <CharacterCount length={value.length} max={max} />}
    </FieldShell>
  );
}

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  error?: string;
  hint?: string;
  className?: string;
};

export function SelectField<T extends string>({ label, value, options, onChange, error, hint, className }: SelectFieldProps<T>) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <NativeSelect id={id} value={value} aria-invalid={Boolean(error)} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
    </FieldShell>
  );
}

export function CheckboxField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={(next) => onChange(next === true)} className="mt-0.5" />
      <Label htmlFor={id} className="flex flex-col items-start gap-0.5 leading-snug">
        <span>{label}</span>
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </Label>
    </div>
  );
}

/** A card on a form page: a heading, an optional line of help, then the fields. */
export function FormSection({ title, description, children, indicator }: { title: string; description?: string; children: ReactNode; indicator?: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle role="heading" aria-level={2} className="flex items-center justify-between">
          {title}
          {indicator}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}
