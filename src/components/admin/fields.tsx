"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 disabled:bg-neutral-100";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
};

function FieldShell({ label, hint, error, htmlFor, children, className }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
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
};

export function TextField({ label, value, onChange, error, hint, placeholder, className, max }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, error && "border-red-500")}
      />
      {max !== undefined && (
        <p className={cn("text-xs", value.length > max ? "font-medium text-red-600" : "text-neutral-500")}>
          {value.length} / {max} characters
        </p>
      )}
    </FieldShell>
  );
}

type TextAreaProps = Omit<TextFieldProps, "placeholder"> & { rows?: number; placeholder?: string; mono?: boolean };

export function TextArea({ label, value, onChange, error, hint, rows = 4, className, max, placeholder, mono }: TextAreaProps) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, "resize-y", mono && "font-mono text-sm", error && "border-red-500")}
      />
      {max !== undefined && (
        <p className={cn("text-xs", value.length > max ? "font-medium text-red-600" : "text-neutral-500")}>
          {value.length} / {max} characters
        </p>
      )}
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
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(inputClass, error && "border-red-500")}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-4 accent-blue-500" />
      <label htmlFor={id} className="flex flex-col text-sm">
        <span className="font-medium text-neutral-800">{label}</span>
        {hint && <span className="text-xs text-neutral-500">{hint}</span>}
      </label>
    </div>
  );
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
      <div>
        <h2 className="font-serif text-2xl text-neutral-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}
