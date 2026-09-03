import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, Mail, FileText, MessageSquare, LayoutDashboard, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: FileText },
  { to: "/chat", label: "AI Assistant", icon: MessageSquare },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "gradient-primary text-primary-foreground shadow-soft hover:text-primary-foreground",
          }}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-soft">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-sm font-semibold">Aura Workspace</p>
        <p className="text-xs text-muted-foreground">AI Productivity Assistant</p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar px-5 py-6 lg:flex">
        <div className="space-y-8">
          <Brand />
          <NavLinks />
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-semibold text-primary-deep">Responsible AI</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            AI output can be inaccurate. Always review and edit before sending or sharing.
          </p>
        </div>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-primary-deep/30 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border bg-sidebar px-5 py-6 transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-8">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/70 bg-background/80 px-5 py-4 backdrop-blur-xl lg:px-10">
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
          </div>
        </header>
        <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">{children}</main>
        <footer className="px-5 pb-8 text-xs text-muted-foreground lg:px-10">
          Aura Workspace uses AI. Responses may be inaccurate or incomplete — review outputs before
          acting on them. No account or sign-in required.
        </footer>
      </div>
    </div>
  );
}
