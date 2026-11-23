import { ChevronDown, ListFilter } from "lucide-react";
import { NativeSelect } from "@/components/admin/ui/native-select";

type Option = { value: string; label: string };

/**
 * A filter that looks like the demo's "Monthly" select trigger: an icon, the chosen option, and a chevron.
 * It is a real <select>, so it works with the keyboard and on phones.
 */
export function ListFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <ListFilter className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" aria-hidden="true" />
      <NativeSelect
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-auto w-fit cursor-pointer appearance-none py-1.5 pr-8 pl-8 text-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}
