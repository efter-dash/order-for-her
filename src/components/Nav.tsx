import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-foreground/5">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="size-8 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
          <div className="size-3 bg-background rounded-sm rotate-45" />
        </div>
        <span className="font-black tracking-tighter text-xl uppercase">Order for Her</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          to="/quiz"
          className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors"
        >
          (01) Profile
        </Link>
        <Link
          to="/scan"
          className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors"
        >
          (02) Scan
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

