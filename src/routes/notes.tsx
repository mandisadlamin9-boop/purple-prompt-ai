import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Aura Workspace" },
      {
        name: "description",
        content:
          "Paste lengthy meeting notes and get a clear summary with decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Aura Workspace" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions, action items and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const summarize = useServerFn(summarizeNotes);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!notes.trim()) {
      setError("Paste your meeting notes before summarizing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await summarize({ data: { notes, meetingTitle } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Decisions, action items and deadlines extracted in seconds"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting title</Label>
            <Input
              id="title"
              placeholder="e.g. Weekly product sync — 12 May"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes or transcript</Label>
            <Textarea
              id="notes"
              rows={16}
              placeholder="Paste raw notes, bullet points or a full transcript here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{notes.length.toLocaleString()} characters</p>
          </div>
          <Button onClick={run} disabled={loading} className="w-full" size="lg">
            <ListChecks className="h-4 w-4" />
            {loading ? "Summarizing…" : "Summarize notes"}
          </Button>
        </section>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRetry={run}
          markdown
          filename="meeting-summary.md"
          emptyHint="Your summary, key decisions, action items and deadlines will appear here."
        />
      </div>
    </AppShell>
  );
}
