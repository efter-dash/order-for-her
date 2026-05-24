import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Nav } from "@/components/Nav";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Order for Her" },
      { name: "description", content: "Sign in to save unlimited partner profiles." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/quiz" });
    });
  }, [navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("You're in. Let's build her profile.");
        navigate({ to: "/quiz" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back 💌");
        navigate({ to: "/quiz" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/quiz",
      });
      if (result.error) throw result.error;
    } catch (err: any) {
      toast.error(err.message ?? "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-md mx-auto px-6 py-12 md:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">
          (∞) {mode === "signup" ? "New here" : "Welcome back"}
        </p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
          {mode === "signup" ? "Save them" : "Sign"}{" "}
          <span className="text-primary italic font-serif lowercase tracking-normal font-semibold">
            {mode === "signup" ? "all" : "in"}
          </span>
          .
        </h1>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full px-6 py-4 bg-foreground text-background font-black uppercase tracking-tighter text-base hover:bg-primary transition-colors active:scale-95 duration-200 disabled:opacity-50 mb-6"
        >
          Continue with Google &rarr;
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-foreground/10" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">or email</span>
          <div className="h-px flex-1 bg-foreground/10" />
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-muted px-4 py-4 outline-none focus:bg-foreground focus:text-background text-base font-medium"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full bg-muted px-4 py-4 outline-none focus:bg-foreground focus:text-background text-base font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 border-2 border-foreground font-black uppercase tracking-tighter text-base hover:bg-foreground hover:text-background transition-colors active:scale-95 duration-200 disabled:opacity-50"
          >
            {loading ? "..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 font-mono text-[10px] uppercase tracking-widest text-foreground/50 hover:text-primary"
        >
          {mode === "signin" ? "→ No account? Sign up" : "→ Already have an account? Sign in"}
        </button>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
          ✦ Or keep going as guest —{" "}
          <Link to="/quiz" className="underline hover:text-primary">1 free profile</Link>
        </p>
      </main>
    </>
  );
}
