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
      <main className="max-w-5xl mx-auto px-5 md:px-6 py-10 md:py-16">
        <section className="animate-in mb-16 md:mb-24">
          {/* Top row: eyebrow + drink */}
          <div className="flex items-start justify-between gap-4 mb-6 md:mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 pt-2">
              (∞) The AI dining concierge
            </p>
            <div className="relative shrink-0 w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <img
                src={drinkImg}
                alt="Pink and green layered cocktail"
                className="relative w-full h-full object-contain heart-float drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase mb-6 md:mb-8">
            Know Her{" "}
            <span className="text-primary italic font-serif lowercase tracking-normal font-semibold">
              cravings
            </span>
            <br />
            Before She Does.
          </h1>

          {/* Description + CTA */}
          <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 md:items-end">
            <p className="max-w-xl text-lg md:text-xl leading-snug text-pretty">
              Build her flavor profile once. Snap a photo of any menu. We tell you exactly what
              to order — and why she'll love it.
            </p>
            <div className="flex flex-col gap-3 md:items-end">
              <Link
                to="/quiz"
                className="w-full md:w-auto text-center px-8 py-5 bg-foreground text-background font-black uppercase tracking-tighter text-lg hover:bg-primary transition-colors active:scale-95 duration-200"
              >
                Build Her Profile &rarr;
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50 whitespace-nowrap">
                ✦ 1 profile free · no account required
              </span>
            </div>
          </div>
        </section>



        <section className="animate-in [animation-delay:200ms] mb-16 md:mb-24 grid grid-cols-1 md:grid-cols-3 gap-1">
          {[
            { n: "01", title: "Take the quiz", body: "Tell us her vibe, dislikes, spice level, allergies." },
            { n: "02", title: "Scan the menu", body: "Upload a screenshot or photo of any restaurant menu." },
            { n: "03", title: "Order with love", body: "Get the perfect pick with a warm, specific reason." },
          ].map((s) => (
            <div key={s.n} className="bg-muted p-6 md:p-8 flex flex-col gap-4 md:aspect-square justify-between min-h-[200px]">
              <span className="font-mono text-4xl md:text-6xl font-black tracking-widest text-primary leading-none">({s.n})</span>
              <div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-3">
                  {s.title}
                </h3>
                <p className="text-sm leading-snug text-foreground/70">{s.body}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="animate-in [animation-delay:400ms] bg-foreground text-background p-8 md:p-12 mb-16 md:mb-24">
          <p className="font-serif italic text-2xl md:text-4xl leading-tight text-balance">
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
