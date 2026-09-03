import { Check, Copy, Download, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  emptyHint: string;
  filename: string;
  markdown?: boolean;
  onRetry?: () => void;
};

export function OutputPanel({
  value,
  onChange,
  loading,
  error,
  emptyHint,
  filename,
  markdown = false,
  onRetry,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([value], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="surface-card flex min-h-[28rem] flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-6 py-4">
        <h2 className="text-sm font-semibold">Output</h2>
        {value && !loading && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditing((e) => !e)}>
              {editing ? "Preview" : "Edit"}
            </Button>
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" variant="outline" onClick={download}>
              <Download className="h-3.5 w-3.5" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 p-6">
        {loading && (
          <div className="space-y-3">
            {[92, 78, 96, 64, 88, 45].map((w, i) => (
              <div
                key={i}
                className="h-3.5 animate-pulse rounded-full bg-accent"
                style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
              />
            ))}
            <p className="pt-4 text-xs text-muted-foreground">Aura is drafting your output…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="rounded-2xl bg-destructive/10 p-3">
              <TriangleAlert className="h-6 w-6 text-destructive" />
            </div>
            <p className="max-w-sm text-sm text-destructive">{error}</p>
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                <RotateCcw className="h-3.5 w-3.5" />
                Try again
              </Button>
            )}
          </div>
        )}

        {!loading && !error && !value && (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-2xl shadow-soft">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}

        {!loading && !error && value && (
          editing || !markdown ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[22rem] resize-y border-border/70 bg-muted/40 text-sm leading-relaxed"
            />
          ) : (
            <div className="prose-purple text-sm">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          )
        )}
      </div>

      {value && !loading && (
        <p className="border-t border-border/70 px-6 py-3 text-xs text-muted-foreground">
          AI-generated and fully editable — review for accuracy before use.
        </p>
      )}
    </section>
  );
}
