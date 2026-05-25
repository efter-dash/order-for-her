import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import {
  CUISINES,
  COMMON_DISLIKES,
  DIETS,
  VIBES,
  saveProfile,
  loadProfile,
  wouldExceedFreeLimit,
  type PartnerProfile,
  type SpiceLevel,
} from "@/lib/profile";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Build Her Profile — Order for Her" },
      { name: "description", content: "A 60-second quiz to capture her flavor map." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const existing = typeof window !== "undefined" ? loadProfile() : null;
  const [profile, setProfile] = useState<PartnerProfile>(
    existing ?? {
      name: "",
      spice: 2,
      cuisines: [],
      dislikes: [],
      allergies: [],
      diet: "No restriction",
      vibe: "Comfort food queen",
      notes: "",
      createdAt: new Date().toISOString(),
    },
  );
  const [customDislike, setCustomDislike] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const navigate = useNavigate();

  function toggle(arr: string[], v: string) {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }

  function addCustomDislike() {
    const v = customDislike.trim();
    if (!v) return;
    if (profile.dislikes.some((d) => d.toLowerCase() === v.toLowerCase())) {
      setCustomDislike("");
      return;
    }
    setProfile({ ...profile, dislikes: [...profile.dislikes, v] });
    setCustomDislike("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error("Give her a name first 💌");
      return;
    }
    const { isSignedIn } = await import("@/lib/profile");
    const signedIn = await isSignedIn();
    if (!signedIn && wouldExceedFreeLimit(profile.name)) {
      setShowUpgrade(true);
      return;
    }
    try {
      await saveProfile({ ...profile, createdAt: profile.createdAt || new Date().toISOString() });
      toast.success("Profile saved. Let's scan a menu.");
      navigate({ to: "/scan" });
    } catch (err: any) {
      toast.error(err.message ?? "Could not save profile");
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8 animate-in">
          <h1 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground/50">
            (01) The Palate Quiz
          </h1>
          <div className="h-1 w-32 bg-foreground/5">
            <div className="h-full bg-secondary" style={{ width: "100%" }} />
          </div>
        </div>

        <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase mb-4 animate-in [animation-delay:100ms]">
          Map her{" "}
          <span className="text-primary italic font-serif lowercase tracking-normal font-semibold">
            palate
          </span>
          .
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-12 animate-in [animation-delay:150ms]">
          ✦ 1 profile free · no account required
        </p>

        <form onSubmit={submit} className="space-y-1 animate-in [animation-delay:200ms]">
          {/* Name */}
          <Section label="Her name">
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g. Sarah"
              className="w-full bg-transparent border-b-2 border-foreground/20 focus:border-primary outline-none text-3xl md:text-4xl font-black uppercase tracking-tighter py-3 placeholder:text-foreground/20"
            />
          </Section>

          {/* Spice */}
          <Section label="Spice tolerance">
            <div className="flex gap-2">
              {([1, 2, 3, 4] as SpiceLevel[]).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setProfile({ ...profile, spice: n })}
                  className={`flex-1 aspect-[2/3] flex flex-col justify-between p-4 transition-colors ${
                    profile.spice >= n ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <span className="text-xs font-mono uppercase tracking-widest">
                    {String(n).padStart(2, "0")}
                  </span>
                  <span className="text-2xl font-black uppercase tracking-tighter leading-none text-left">
                    {["Mild", "Med", "Hot", "Fire"][n - 1]}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          {/* Cuisines */}
          <Section label="Favorite cuisines (pick any)">
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => {
                const active = profile.cuisines.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setProfile({ ...profile, cuisines: toggle(profile.cuisines, c) })}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-widest border transition-colors ${
                      active
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent border-foreground/10 hover:border-foreground"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Dislikes */}
          <Section label="Hard dislikes">
            <p className="text-sm italic opacity-50 mb-3">"She says it tastes like soap..."</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_DISLIKES.map((d) => {
                const active = profile.dislikes.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setProfile({ ...profile, dislikes: toggle(profile.dislikes, d) })}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-foreground/10 hover:border-primary"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Allergies */}
          <Section label="Allergies (comma-separated)">
            <input
              value={profile.allergies.join(", ")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  allergies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder="e.g. peanuts, shellfish"
              className="w-full bg-muted px-4 py-3 outline-none focus:bg-foreground focus:text-background text-base font-medium"
            />
          </Section>

          {/* Diet */}
          <Section label="Diet">
            <div className="flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setProfile({ ...profile, diet: d })}
                  className={`px-4 py-2 text-sm font-bold uppercase tracking-widest border transition-colors ${
                    profile.diet === d
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground/10 hover:border-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </Section>

          {/* Vibe */}
          <Section label="Her food vibe">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {VIBES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setProfile({ ...profile, vibe: v })}
                  className={`text-left px-5 py-4 border transition-colors ${
                    profile.vibe === v
                      ? "bg-secondary border-foreground"
                      : "border-foreground/10 hover:border-foreground"
                  }`}
                >
                  <span className="font-black uppercase tracking-tighter text-lg">{v}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* Notes */}
          <Section label="Anything else she's mentioned lately?">
            <textarea
              value={profile.notes}
              onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
              placeholder="e.g. she's been craving something pillowy and warm..."
              rows={3}
              className="w-full bg-muted px-4 py-3 outline-none focus:bg-foreground focus:text-background text-base font-medium resize-none"
            />
          </Section>

          <div className="pt-8">
            <button
              type="submit"
              className="w-full md:w-auto px-12 py-5 bg-foreground text-background font-black uppercase tracking-tighter text-lg hover:bg-primary transition-colors active:scale-95 duration-200"
            >
              Save & Scan a Menu &rarr;
            </button>
          </div>
        </form>
      </main>

      {showUpgrade && (
        <div
          className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in"
          onClick={() => setShowUpgrade(false)}
        >
          <div
            className="bg-background border-[6px] border-foreground max-w-md w-full p-8 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-4">
              ✦ Free tier limit
            </p>
            <h3 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              One free profile{" "}
              <span className="text-primary italic font-serif lowercase tracking-normal font-semibold">
                used.
              </span>
            </h3>
            <p className="text-base text-foreground/70 mb-8 leading-snug">
              You're on the house tier — one partner profile, no account needed. Want to save
              profiles for friends, exes, or your situationship? Upgrade to unlock unlimited.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/auth" })}
                className="w-full px-6 py-4 bg-foreground text-background font-black uppercase tracking-tighter text-base hover:bg-primary transition-colors active:scale-95 duration-200"
              >
                Sign up for unlimited &rarr;
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUpgrade(false);
                  if (existing) {
                    setProfile({ ...profile, name: existing.name });
                    toast.info(`Editing ${existing.name}'s profile instead.`);
                  }
                }}
                className="w-full px-6 py-3 border border-foreground/20 font-bold uppercase tracking-widest text-xs hover:border-foreground transition-colors"
              >
                {existing ? `Keep editing ${existing.name}` : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-6 border-t border-foreground/10">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-4">
        {label}
      </p>
      {children}
    </div>
  );
}
