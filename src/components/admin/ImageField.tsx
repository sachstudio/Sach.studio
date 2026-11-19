"use client";

import { upload } from "@vercel/blob/client";
import { useId, useRef, useState } from "react";
import { validateUpload } from "@/lib/upload-rules";
import { inputClass } from "./fields";

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
      <label htmlFor={id} className="text-sm font-medium text-neutral-800">
        {label}
      </label>
      <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 sm:flex-row">
        <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white sm:w-44">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={`${label} preview`} className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-neutral-400">No image</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Upload an image, or paste its address"
            className={inputClass}
            aria-invalid={Boolean(shown)}
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
            <label
              htmlFor={`${id}-file`}
              className="cursor-pointer rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      {hint && !shown && <p className="text-xs text-neutral-500">{hint}</p>}
      {shown && (
        <p role="alert" className="text-sm text-red-600">
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
      <legend className="text-sm font-medium text-neutral-800">{label}</legend>
      {value.map((url, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-3">
          <ImageField
            label={`${label} ${i + 1}`}
            value={url}
            folder={folder}
            onChange={(next) => onChange(value.map((u, idx) => (idx === i ? next : u)))}
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => {
                const next = [...value];
                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                onChange(next);
              }}
              className="rounded-md border border-neutral-200 px-2.5 py-1 text-sm disabled:opacity-40"
            >
              Move up
            </button>
            <button
              type="button"
              disabled={i === value.length - 1}
              onClick={() => {
                const next = [...value];
                [next[i + 1], next[i]] = [next[i], next[i + 1]];
                onChange(next);
              }}
              className="rounded-md border border-neutral-200 px-2.5 py-1 text-sm disabled:opacity-40"
            >
              Move down
            </button>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="rounded-md px-2.5 py-1 text-sm text-red-600 hover:bg-red-50"
            >
              Remove image
            </button>
          </div>
        </div>
      ))}
      <div>
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          + Add image
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}
