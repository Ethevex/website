"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type SourcePanelProps = {
  title: string;
  filename: string;
  source: string;
  /** Escaped markup produced by the server-side Shiki highlighter only. */
  highlightedHtml?: string;
  open?: boolean;
};

export function SourcePanel({ title, filename, source, highlightedHtml, open = false }: SourcePanelProps) {
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setStatus(`${filename} copied.`);
    } catch {
      setStatus("Copy is unavailable. Select and copy the code below manually.");
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([source], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    // Defer revocation until the browser has consumed the download URL.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <details open={open} className="min-w-0 border border-foreground/15">
      <summary className="cursor-pointer px-5 py-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
        {title}
      </summary>
      <div className="min-w-0 border-t border-foreground/15 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="break-all font-mono text-xs text-foreground/65">{filename}</span>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={copy} aria-label={`Copy ${filename}`} className="min-h-11 rounded-none transition-none">Copy</Button>
            <Button type="button" variant="outline" onClick={download} aria-label={`Download ${filename}`} className="min-h-11 rounded-none transition-none">Download</Button>
          </div>
        </div>
        <p role="status" aria-live="polite" className="mt-2 min-h-5 text-xs leading-relaxed text-foreground/70">{status}</p>
        {highlightedHtml ? (
          <div className="brand-source-code mt-3 min-w-0" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        ) : (
          <pre tabIndex={0} aria-label={`${filename} source code`} className="mt-3 max-h-96 max-w-full overflow-auto bg-muted p-4 text-xs leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"><code>{source}</code></pre>
        )}
      </div>
    </details>
  );
}
