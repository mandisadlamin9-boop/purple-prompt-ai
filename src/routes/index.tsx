import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, MessageSquare, ArrowRight, ShieldCheck, Zap, Pencil } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura Workspace — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft professional emails, summarize meeting notes into action items, and chat with an AI workplace assistant. No sign-up required.",
      },
      { property: "og:title", content: "Aura Workspace — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Premium AI assistant for emails, meeting summaries and everyday workplace productivity.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    text: "Professional emails in Formal, Friendly or Persuasive tone — ready to edit and send.",
  },
  {
    to: "/notes",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    text: "Turn long notes into a summary with decisions, action items and deadlines.",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Assistant",
    text: "Ask anything about planning, prioritising, writing and workplace communication.",
  },
] as const;

const HIGHLIGHTS = [
  { icon: Zap, title: "Instant access", text: "No account, no sign-in, no setup." },
  { icon: Pencil, title: "Editable outputs", text: "Every result is yours to refine." },
  { icon: ShieldCheck, title: "Responsible AI", text: "Clear disclaimers on every result." },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace for writing, meetings and everyday productivity"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="surface-card relative overflow-hidden p-8 lg:p-12">
          <div className="gradient-primary absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            AI Workplace Productivity
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight lg:text-5xl">
            Do your best work with <span className="gradient-text">Aura</span>, your AI workplace
            assistant.
          </h2>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground lg:text-base">
            Draft polished emails, distil messy meeting notes into clear action items, and get
            instant answers — all in one elegant workspace. No registration required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="gradient-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition-transform hover:-translate-y-0.5"
            >
              Generate an email <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-accent"
            >
              Open assistant
            </Link>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {TOOLS.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              className="surface-card group p-6 transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-xl shadow-soft">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>

        <section className="grid gap-5 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl bg-secondary/70 p-5">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
