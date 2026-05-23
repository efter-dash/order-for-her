import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { Nav } from "@/components/Nav";
import { loadProfile } from "@/lib/profile";
import { analyzeMenu } from "@/lib/analyze-menu.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan a Menu — Order for Her" },
      { name: "description", content: "Upload any restaurant menu and get the perfect pick." },
    ],
  }),
  component: ScanPage,
});

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [meta, b64] = dataUrl.split(",");
      const match = /data:([^;]+);base64/.exec(meta);
      resolve({ base64: b64, mimeType: match?.[1] ?? file.type ?? "image/jpeg" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ScanPage() {
  const [profileMissing, setProfileMissing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const analyze = useServerFn(analyzeMenu);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadProfile()) setProfileMissing(true);
  }, []);

  async function onFile(file: File) {
    const profile = loadProfile();
    if (!profile) {
      toast.error("Build her profile first.");
      navigate({ to: "/quiz" });
      return;
    }
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const result = await analyze({
        data: {
          imageBase64: base64,
          mimeType,
          profile: {
            name: profile.name,
            spice: profile.spice,
            cuisines: profile.cuisines,
            dislikes: profile.dislikes,
            allergies: profile.allergies,
            diet: profile.diet,
            vibe: profile.vibe,
            notes: profile.notes,
          },
        },
      });
      sessionStorage.setItem("ofh.lastPick", JSON.stringify(result));
      navigate({ to: "/result" });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went sideways. Try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-4 animate-in">
          (02) The Menu Scan
        </p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase mb-12 animate-in [animation-delay:100ms]">
          Show us the{" "}
          <span className="text-primary italic font-serif lowercase tracking-normal font-semibold">
            menu
          </span>
          .
        </h1>

        {profileMissing && (
          <div className="bg-primary text-primary-foreground p-6 mb-8 animate-in">
            <p className="font-black uppercase tracking-tighter text-xl mb-2">
              Build her profile first
            </p>
            <p className="text-sm mb-4 opacity-90">
              We need to know her palate before we can pick for her.
            </p>
            <Link
              to="/quiz"
              className="inline-block bg-background text-foreground px-6 py-3 font-black uppercase tracking-tighter text-sm"
            >
              Take the quiz &rarr;
            </Link>
          </div>
        )}

        <div className="bg-secondary p-1 animate-in [animation-delay:200ms]">
          <div className="bg-background border-[6px] border-foreground p-8 md:p-16 text-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy || profileMissing}
              className="group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                className={`size-24 mx-auto mb-6 rounded-full bg-foreground flex items-center justify-center transition-transform group-hover:scale-110 ${
                  busy ? "pulse-ring" : ""
                }`}
              >
                <div className="size-8 rounded-full border-4 border-background" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3">
                {busy ? "Reading the menu..." : "Tap to upload"}
              </h2>
              <p className="text-xs uppercase tracking-[0.25em] font-black opacity-50">
                {busy ? "AI is matching her profile" : "Camera roll or screenshot"}
              </p>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />

            {preview && (
              <div className="mt-10 max-w-xs mx-auto rotate-2 shadow-2xl">
                <img src={preview} alt="Menu preview" className="w-full block" />
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.25em] opacity-40">
          ↓ Powered by AI vision · Matches against her saved profile
        </p>
      </main>
    </>
  );
}
