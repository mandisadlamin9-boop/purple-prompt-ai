import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles, TriangleAlert, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Aura Workspace" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant for planning, prioritising, writing and everyday productivity questions.",
      },
      { property: "og:title", content: "AI Assistant — Aura Workspace" },
      {
        property: "og:description",
        content: "An interactive AI workplace assistant — no account needed.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prioritise my tasks for this week",
  "Write an agenda for a 30-minute project kickoff",
  "How do I politely decline a meeting invite?",
  "Turn these bullets into a status update for leadership",
];

function ChatPage() {
  const send = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The assistant is unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Assistant" description="Ask Aura anything about your work day">
      <div className="mx-auto flex h-[calc(100vh-16rem)] min-h-[32rem] max-w-4xl flex-col">
        <div className="surface-card flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            {messages.length === 0 && !loading && (
              <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                <div className="gradient-primary flex h-14 w-14 items-center justify-center rounded-2xl shadow-elevated">
                  <Sparkles className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">How can I help today?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Start with a prompt below or write your own.
                  </p>
                </div>
                <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end gap-3" : "flex gap-3"}
              >
                {m.role === "assistant" && (
                  <div className="gradient-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={
                    m.role === "user"
                      ? "gradient-primary max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-sm text-primary-foreground shadow-soft"
                      : "prose-purple max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary/70 px-4 py-3 text-sm"
                  }
                >
                  {m.role === "user" ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
                </div>
                {m.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="gradient-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-secondary/70 px-4 py-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 animate-bounce rounded-full bg-primary/60"
                      style={{ animationDelay: `${i * 140}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <TriangleAlert className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border/70 p-4">
            <div className="flex items-end gap-2">
              <Textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(input);
                  }
                }}
                placeholder="Ask Aura anything…"
                className="max-h-40 min-h-[2.75rem] resize-none"
              />
              <Button size="lg" onClick={() => submit(input)} disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              AI can make mistakes — verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
