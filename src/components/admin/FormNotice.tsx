import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "cn";

/** The result of the last save, publish or delete, shown above the form. */
export function FormNotice({ kind, text }: { kind: "ok" | "error"; text: string }) {
  const Icon = kind === "ok" ? CircleCheck : CircleAlert;
  return (
    <p
      role={kind === "ok" ? "status" : "alert"}
      className={cn(
        "motion-enter-small flex items-start gap-2 rounded-lg border px-4 py-3 text-sm font-medium",
        kind === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {text}
    </p>
  );
}
