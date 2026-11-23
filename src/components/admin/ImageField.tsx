"use client";

import { upload } from "@vercel/blob/client";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2, Upload } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { validateUpload } from "@/lib/upload-rules";

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  hint?: string;
  /** Folder name inside the Blob store, for example "case-studies". */
  folder?: string;
};

/** Pick a file to upload to Vercel Blob (checked in the browser first), or keep an existing image address. */
export function ImageField({ label, value, onChange, error, hint, folder = "uploads" }: ImageFieldProps) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setProblem(null);
    const check = validateUpload(file);
    if (!check.ok) {
      setProblem(check.error);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setBusy(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
      const blob = await upload(`${folder}/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      onChange(blob.url);
    } catch (e) {
      setProblem(e instanceof Error && e.message ? e.message : "The upload failed. Try again.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const shown = problem ?? error;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-3 sm:flex-row">
        <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background sm:w-44">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={`${label} preview`} className="h-full w-full object-contain" />
          ) : (
            <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <ImagePlus className="size-5" aria-hidden="true" />
              No image
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Upload an image, or paste its address"
            aria-invalid={Boolean(shown)}
            className="bg-background"
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
              className="sr-only"
              id={`${id}-file`}
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Button asChild variant="outline" size="sm">
              <label htmlFor={`${id}-file`} className="cursor-pointer">
                <Upload />
                {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
              </label>
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
      {hint && !shown && <p className="text-xs text-muted-foreground">{hint}</p>}
      {shown && (
        <p role="alert" className="text-sm text-destructive">
          {shown}
        </p>
      )}
    </div>
  );
}

/** Several images in order: feature images and the gallery. */
export function ImageListField({
  label,
  value,
  onChange,
  folder,
  error,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  folder?: string;
  error?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      {value.map((url, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-lg border p-3">
          <ImageField
            label={`${label} ${i + 1}`}
            value={url}
            folder={folder}
            onChange={(next) => onChange(value.map((u, idx) => (idx === i ? next : u)))}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={i === 0}
              onClick={() => {
                const next = [...value];
                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                onChange(next);
              }}
            >
              <ArrowUp /> Move up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={i === value.length - 1}
              onClick={() => {
                const next = [...value];
                [next[i + 1], next[i]] = [next[i], next[i + 1]];
                onChange(next);
              }}
            >
              <ArrowDown /> Move down
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
              <Trash2 /> Remove image
            </Button>
          </div>
        </div>
      ))}
      <div>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, ""])}>
          <Plus /> Add image
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
