import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import drinkImg from "@/assets/drink.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Order for Her — Know her cravings before she does" },
      {
        name: "description",
        content:
          "AI-powered dining companion. Build her flavor profile, scan any menu, get the perfect order with a heartfelt reason why.",
      },
      { property: "og:title", content: "Order for Her" },
      {
        property: "og:description",
        content: "Gift her the perfect order, every time. Powered by AI.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <section className="animate-in mb-24 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">
              (∞) The AI dining concierge
            </p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase mb-8">
              Know Her{" "}
              <span className="text-primary italic font-serif lowercase tracking-normal font-semibold">
                cravings
              </span>
              <br />
              Before She Does.
            </h1>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <p className="max-w-md text-xl leading-snug text-pretty">
                Build her flavor profile once. Snap a photo of any menu. We tell you exactly what
                to order — and why she'll love it.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/quiz"
                  className="px-8 py-5 bg-foreground text-background font-black uppercase tracking-tighter text-lg hover:bg-primary transition-colors active:scale-95 duration-200"
                >
                  Build Her Profile &rarr;
                </Link>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                  ✦ 1 profile free · no account required
                </span>
              </div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <img
              src={drinkImg}
              alt="Pink and green layered cocktail"
              width={320}
              height={320}
              className="relative w-72 h-72 object-contain heart-float drop-shadow-2xl"
            />
          </div>
        </section>


        <section className="animate-in [animation-delay:200ms] mb-24 grid grid-cols-1 md:grid-cols-3 gap-1">
          {[
            { n: "01", title: "Take the quiz", body: "Tell us her vibe, dislikes, spice level, allergies." },
            { n: "02", title: "Scan the menu", body: "Upload a screenshot or photo of any restaurant menu." },
            { n: "03", title: "Order with love", body: "Get the perfect pick with a warm, specific reason." },
          ].map((s) => (
            <div key={s.n} className="bg-muted p-8 flex flex-col gap-4 aspect-square justify-between">
              <span className="font-mono text-5xl md:text-6xl font-black tracking-widest text-primary leading-none">({s.n})</span>
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-3">
                  {s.title}
                </h3>
                <p className="text-sm leading-snug text-foreground/70">{s.body}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="animate-in [animation-delay:400ms] bg-foreground text-background p-12 mb-24">
          <p className="font-serif italic text-3xl md:text-4xl leading-tight text-balance">
            "She mentioned wanting something pillowy last Tuesday. This matches her love for
            earthy flavors without the heavy garlic she usually skips."
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">
            — How the AI thinks
          </p>
        </section>

        <footer className="text-center py-12 border-t border-foreground/5">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30">
            Order for Her © 2026 — Built for the thoughtful partner
          </p>
        </footer>
      </main>
    </>
  );
}
