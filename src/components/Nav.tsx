import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Nav() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-background/80 backdrop-blur-md border-b border-foreground/5">
      <Link to="/" className="flex items-center gap-2 group min-w-0">
        <div className="size-7 md:size-8 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 shrink-0">
          <div className="size-2.5 md:size-3 bg-background rounded-sm rotate-45" />
        </div>
        <span className="font-black tracking-tighter text-base md:text-xl uppercase truncate">
          Order for Her
        </span>
      </Link>
      <div className="flex items-center gap-3 md:gap-5 shrink-0">
        <Link
          to="/quiz"
          className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors"
        >
          (01) Profile
        </Link>
        <Link
          to="/scan"
          className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors"
        >
          (02) Scan
        </Link>
        {signedIn ? (
          <button
            onClick={signOut}
            className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors"
          >
            Sign out
          </button>
        ) : (
          <Link
            to="/auth"
            className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors"
          >
            Sign in
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
