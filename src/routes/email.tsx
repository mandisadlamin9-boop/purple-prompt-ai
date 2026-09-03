import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Aura Workspace" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in a Formal, Friendly or Persuasive tone, then edit and copy them instantly.",
      },
      { property: "og:title", content: "Smart Email Generator — Aura Workspace" },
      {
        property: "og:description",
        content: "AI-written professional emails with selectable tone and editable output.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
const LENGTHS = ["Short", "Medium", "Detailed"] as const;

function EmailPage() {
  const generate = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>("Medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!purpose.trim()) {
      setError("Describe what the email should say before generating.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await generate({ data: { recipient, subject, purpose, tone, length } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the message — Aura writes a polished, ready-to-send email"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Priya, Head of Design"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject hint</Label>
              <Input
                id="subject"
                placeholder="e.g. Q3 roadmap review"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">What should the email say?</Label>
            <Textarea
              id="purpose"
              rows={7}
              placeholder="Ask the design team to move the roadmap review to Thursday, mention the client deadline and request confirmation by tomorrow."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={
                    tone === t
                      ? "gradient-primary rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft"
                      : "rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Length</Label>
            <div className="flex flex-wrap gap-2">
              {LENGTHS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  className={
                    length === l
                      ? "rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
                      : "rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
                  }
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={run} disabled={loading} className="w-full" size="lg">
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </section>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRetry={run}
          filename="email.txt"
          emptyHint="Your generated email will appear here, fully editable before you send it."
        />
      </div>
    </AppShell>
  );
}
