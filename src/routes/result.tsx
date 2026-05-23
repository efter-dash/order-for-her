import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { loadProfile, type PartnerProfile } from "@/lib/profile";
import type { MenuPick } from "@/lib/analyze-menu.functions";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "The Perfect Order — Order for Her" },
      { name: "description", content: "Her perfect dish, picked by AI." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const [pick, setPick] = useState<MenuPick | null>(null);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("ofh.lastPick");
    if (raw) setPick(JSON.parse(raw));
    setProfile(loadProfile());
  }, []);

  if (!pick) {
    return (
      <>
        <Nav />
        <main className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">
            No pick yet.
          </h1>
          <Link
            to="/scan"
            className="inline-block px-8 py-4 bg-foreground text-background font-black uppercase tracking-tighter"
          >
            Scan a menu &rarr;
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-12 animate-in">
          <div className="size-12 rounded-full bg-primary flex items-center justify-center heart-float">
            <div className="size-4 bg-background rounded-sm rotate-45 -translate-y-0.5" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
            The Perfect Order
          </h1>
        </div>

        <div className="bg-foreground text-background p-8 md:p-12 mb-12 animate-in [animation-delay:150ms]">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="w-full md:w-1/3 aspect-square bg-secondary flex items-center justify-center p-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 text-center">
                Match Score
                <span className="block text-7xl font-black text-foreground mt-2 tracking-tighter">
                  {pick.matchScore}
                </span>
                <span className="block text-foreground text-2xl font-black">/100</span>
              </span>
            </div>
            <div className="flex-1">
              <span className="font-mono text-xs text-primary mb-2 block uppercase tracking-widest">
                {profile?.name ? `For ${profile.name}` : "AI Recommendation"}
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                {pick.dish}
              </h2>

              <div className="bg-background text-foreground p-6 shadow-2xl relative rotate-1">
                <p className="font-serif text-xl md:text-2xl leading-tight italic">
                  "{pick.reason}"
                </p>
                <div className="mt-4 pt-4 border-t border-foreground/10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                    AI Reasoning · Matched against her profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {pick.alternates?.length > 0 && (
          <section className="mb-16 animate-in [animation-delay:300ms]">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-6">
              (Backup picks)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {pick.alternates.map((a, i) => (
                <div key={i} className="bg-muted p-6 flex flex-col gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary">
                    Option 0{i + 2}
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
                    {a.dish}
                  </h3>
                  <p className="text-sm leading-snug opacity-70">{a.reason}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col md:flex-row gap-1">
          <Link
            to="/scan"
            className="flex-1 px-8 py-5 bg-foreground text-background font-black uppercase tracking-tighter text-center hover:bg-primary transition-colors"
          >
            Scan another menu
          </Link>
          <Link
            to="/quiz"
            className="flex-1 px-8 py-5 bg-muted text-foreground font-black uppercase tracking-tighter text-center hover:bg-secondary transition-colors"
          >
            Edit her profile
          </Link>
        </div>
      </main>
    </>
  );
}
