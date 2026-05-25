import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ImageSchema = z.object({
  imageBase64: z.string().min(20),
  mimeType: z.string().default("image/jpeg"),
});

const InputSchema = z.object({
  // Back-compat: allow single image fields or an images array
  imageBase64: z.string().min(20).optional(),
  mimeType: z.string().optional(),
  images: z.array(ImageSchema).min(1).max(6).optional(),
  profile: z.object({
    name: z.string(),
    spice: z.number(),
    cuisines: z.array(z.string()),
    dislikes: z.array(z.string()),
    allergies: z.array(z.string()),
    diet: z.string(),
    vibe: z.string(),
    notes: z.string(),
  }),
}).refine((d) => d.images?.length || d.imageBase64, {
  message: "Provide at least one menu image",
});

export type MenuPick = {
  dish: string;
  matchScore: number;
  reason: string;
  alternates: { dish: string; reason: string }[];
};

export const analyzeMenu = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<MenuPick> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const { profile } = data;
    const images = data.images?.length
      ? data.images
      : [{ imageBase64: data.imageBase64!, mimeType: data.mimeType ?? "image/jpeg" }];

    const spiceWord = ["mild", "mild-medium", "medium-hot", "fire-eater"][profile.spice - 1] ?? "medium";

    const systemPrompt = `You are "Order for Her", a thoughtful AI dining concierge. Given a partner's taste profile and one or more photos of a restaurant menu (which may span multiple pages or sections), recommend exactly ONE dish that she'll love most. You must:
- Only pick a dish that actually appears in the provided menu images.
- Avoid anything containing her dislikes or allergies.
- Match her cuisine preferences, spice tolerance (${spiceWord}), diet, and vibe.
- Write the reason in a warm, intimate, second-person voice to the partner ordering (he/they), referencing why she'll love it.
- Also suggest 2 backup picks from the same menu.
Return ONLY valid JSON, no markdown, no prose outside JSON.`;

    const userText = `Her profile:
- Name: ${profile.name || "her"}
- Favorite cuisines: ${profile.cuisines.join(", ") || "open to anything"}
- Hard dislikes: ${profile.dislikes.join(", ") || "none"}
- Allergies: ${profile.allergies.join(", ") || "none"}
- Diet: ${profile.diet}
- Vibe: ${profile.vibe}
- Spice tolerance: ${spiceWord} (${profile.spice}/4)
- Extra notes: ${profile.notes || "none"}

You are given ${images.length} menu image(s). Consider all of them together and return JSON in this exact shape:
{
  "dish": "name of the dish exactly as written on the menu",
  "matchScore": 0-100 integer,
  "reason": "2-3 warm sentences explaining why she'll love it, referencing her specific preferences",
  "alternates": [
    { "dish": "second pick", "reason": "1 sentence" },
    { "dish": "third pick", "reason": "1 sentence" }
  ]
}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userText },
              ...images.map((img) => ({
                type: "image_url" as const,
                image_url: { url: `data:${img.mimeType};base64,${img.imageBase64}` },
              })),
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      if (resp.status === 429) throw new Error("Rate limit hit — give it a sec and try again.");
      if (resp.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      console.error("AI gateway error", resp.status, t);
      throw new Error("Menu analysis failed");
    }

    const json = await resp.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: MenuPick;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("AI returned malformed response");
    }
    return parsed;
  });
