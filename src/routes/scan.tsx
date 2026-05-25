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

const MAX_IMAGES = 6;

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

type Pending = { file: File; previewUrl: string };

function ScanPage() {
  const [profileMissing, setProfileMissing] = useState(false);
  const [pending, setPending] = useState<Pending[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const analyze = useServerFn(analyzeMenu);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadProfile()) setProfileMissing(true);
  }, []);

  useEffect(() => {
    return () => {
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(files: FileList | File[]) {
    const list = Array.from(files);
    setPending((prev) => {
      const remaining = MAX_IMAGES - prev.length;
      if (remaining <= 0) {
        toast.error(`Max ${MAX_IMAGES} images`);
        return prev;
      }
      const next = list.slice(0, remaining).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      if (list.length > remaining) toast.info(`Only added first ${remaining} image(s)`);
      return [...prev, ...next];
    });
  }

  function removeAt(idx: number) {
    setPending((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(idx, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });
  }

  async function run() {
    const profile = loadProfile();
    if (!profile) {
      toast.error("Build her profile first.");
      navigate({ to: "/quiz" });
      return;
    }
    if (pending.length === 0) {
      toast.error("Add at least one menu image");
      return;
    }
    setBusy(true);
    try {
      const images = await Promise.all(
        pending.map(async (p) => {
          const { base64, mimeType } = await fileToBase64(p.file);
          return { imageBase64: base64, mimeType };
        }),
      );
      const result = await analyze({
        data: {
          images,
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
      // Clean previews — images are not saved
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
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
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase mb-4 animate-in [animation-delay:100ms]">
          Show us the{" "}
          <span className="text-primary italic font-serif lowercase tracking-normal font-semibold">
            menu
          </span>
          .
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-12 animate-in [animation-delay:150ms]">
          ✦ Upload up to {MAX_IMAGES} pages · images never saved
        </p>

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
          <div className="bg-background border-[6px] border-foreground p-8 md:p-12 text-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy || profileMissing || pending.length >= MAX_IMAGES}
              className="group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                className={`size-20 mx-auto mb-5 rounded-full bg-foreground flex items-center justify-center transition-transform group-hover:scale-110 ${
                  busy ? "pulse-ring" : ""
                }`}
              >
                <div className="size-7 rounded-full border-4 border-background" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2">
                {pending.length === 0 ? "Tap to upload" : `Add more (${pending.length}/${MAX_IMAGES})`}
              </h2>
              <p className="text-xs uppercase tracking-[0.25em] font-black opacity-50">
                Multiple pages welcome · jpg, png, screenshots
              </p>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length) addFiles(files);
                e.target.value = "";
              }}
            />

            {pending.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
                {pending.map((p, i) => (
                  <div key={p.previewUrl} className="relative group">
                    <img
                      src={p.previewUrl}
                      alt={`Menu page ${i + 1}`}
                      className="w-full aspect-[3/4] object-cover border-2 border-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      disabled={busy}
                      className="absolute top-1 right-1 size-7 bg-foreground text-background font-black text-xs flex items-center justify-center hover:bg-primary disabled:opacity-50"
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1 left-1 bg-foreground text-background text-[10px] font-mono px-2 py-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {pending.length > 0 && (
              <button
                type="button"
                onClick={run}
                disabled={busy}
                className="mt-8 w-full md:w-auto px-12 py-5 bg-foreground text-background font-black uppercase tracking-tighter text-lg hover:bg-primary transition-colors active:scale-95 duration-200 disabled:opacity-60"
              >
                {busy ? "Reading the menu…" : `Find her pick →`}
              </button>
            )}
          </div>
        </div>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.25em] opacity-40">
          ↓ Powered by AI vision · Menu images are processed once, never stored
        </p>
      </main>
    </>
  );
}
