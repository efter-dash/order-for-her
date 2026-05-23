Implement a "1 profile free, no signup" tier with an upgrade nudge for unlimited profiles.

1.  **Refactor localStorage profile storage** to support an array of profiles and a `freeTierUsed` flag. Update `src/lib/profile.ts` with `loadProfiles()`, `saveProfile()`, `canCreateFreeProfile()`, and `hasReachedFreeLimit()` helpers.

2.  **Enforce the free limit** in `src/routes/quiz.tsx`. When the user clicks "Save & Scan":
    - If no profile exists, save freely.
    - If 1 profile already exists and user is not signed in, block saving and show an upgrade nudge instead.

3.  **Add "no signup needed" messaging** to the landing page (`src/routes/index.tsx`) and quiz page (`src/routes/quiz.tsx`) — e.g., a small badge or subtext under CTAs: "1 profile free · no account required".

4.  **Build the upgrade nudge UI** — a modal or inline card on the quiz page that says "You've used your free profile" with a CTA to upgrade for unlimited profiles. Keep the Gen-Z editorial styling.

5.  **(Optional) Set up Paddle payments** so the upgrade CTA actually works. Paddle is recommended for this product type. If the user approves, integrate Paddle for a one-time or subscription unlock.