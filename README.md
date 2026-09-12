# Order for Her 🍽️

### An AI dining concierge that remembers her taste and helps you figure out what to order from any menu.

🌐 **Live App:** [order-for-her.lovable.app](https://order-for-her.lovable.app)

---

## About Order for Her

**Order for Her** is an AI-powered dining companion built around a simple idea:

Sometimes choosing food for someone you care about is harder than it should be.

You know the person.

You know what they usually like.

You vaguely remember that they hate olives, like medium spice, love Japanese food, don't enjoy heavy garlic, or mentioned wanting something comforting recently.

But when you're staring at a completely unfamiliar restaurant menu, putting all of that together can still be difficult.

Order for Her turns those scattered preferences into a reusable **taste profile**.

Upload a restaurant menu, and the AI uses that profile to help identify what she is most likely to enjoy — along with the reasoning behind the recommendation.

---

## 💡 The Core Idea

Instead of asking:

> **“What's the best dish on this menu?”**

Order for Her asks:

> **“What's the best dish on this menu for this particular person?”**

The difference is personalization.

```text
Her Preferences
      ↓
Taste Profile
      ↓
Restaurant Menu
      ↓
AI Analysis
      ↓
Best-Matching Dish
      ↓
Why She'll Probably Like It
```

The goal is to make choosing food feel less like guessing and more like remembering.

---

# ✨ How It Works

## 01 — Build Her Taste Profile

Create a profile around the things that actually influence someone's food choices.

The current profile considers information such as:

- Spice tolerance
- Favorite cuisines
- Strong dislikes
- Allergies
- Dietary preferences
- General food personality
- Custom preferences
- Things she may have mentioned recently

The idea is to capture more than just:

**“She likes Italian food.”**

Food preferences are contextual, so the profile is designed to capture some of that nuance.

---

## 02 — Scan a Restaurant Menu

Upload a screenshot or photo of a restaurant menu.

The AI can then interpret the available dishes and compare them against the saved taste profile.

This means the experience isn't tied to one restaurant, cuisine, or fixed food database.

The menu becomes the context.

---

## 03 — Get a Personalized Recommendation

Order for Her identifies the dish that appears to fit her preferences best.

Instead of returning only a dish name, the experience is designed to explain **why** the recommendation makes sense.

That reasoning might consider things such as:

- Cuisine preferences
- Flavor preferences
- Spice tolerance
- Ingredient dislikes
- Dietary restrictions
- Allergies
- Current food mood
- Previous context saved in the profile

The recommendation therefore becomes more useful than a generic restaurant ranking.

---

# 🧠 Product Philosophy

## Remember the person, not just the order

Food choices are rarely based on a single preference.

Someone might love spicy food but dislike certain ingredients.

They might generally prefer healthy meals but occasionally want comfort food.

Order for Her treats taste as a profile rather than a checkbox.

---

## Use AI for context

The AI isn't there simply because this is an AI project.

Its role is to connect two pieces of unstructured information:

**A person's preferences**

and

**A restaurant's menu**

Then reason about the relationship between them.

---

## Explain the recommendation

A recommendation becomes more valuable when you understand why it was made.

The product therefore aims to give the user enough context to make the final decision themselves.

---

## Make thoughtfulness easier

The larger idea behind the product isn't really food.

It's remembering the little things someone cares about and using technology to make acting on those details easier.

---

# 🤖 How This Project Was Built

Order for Her is an **AI-assisted / vibe-coded product**.

I am not a traditional software developer and did not manually engineer every component of the application from scratch.

I approached the project primarily from the perspective of:

- Product concept
- User problem
- Feature definition
- User journey
- Interaction design
- UI/UX decisions
- AI behavior
- Prompting and requirements
- Testing
- Debugging
- Iteration
- Product refinement

AI-assisted development tools were then used to translate those decisions into a working application.

My process is closer to:

```text
Problem
   ↓
Product Concept
   ↓
User Experience
   ↓
Detailed Requirements
   ↓
AI-Assisted Implementation
   ↓
Test the Product
   ↓
Find Problems
   ↓
Refine Logic / UX
   ↓
Implement Again
   ↓
Repeat
   ↓
Ship
```

I have foundational familiarity with web development, CSS, UI/UX and coding concepts, which helps me understand what is being built, communicate requirements to AI development tools and troubleshoot the product during development.

The project is an exploration of:

**Product Thinking × AI × Personalization × UX × Creative Problem Solving**

---

# 🛠️ Current Technology

The current application uses technologies including:

- **Lovable** — AI-assisted development and deployment
- **React**
- **TypeScript**
- **Vite**
- **TanStack**
- **Tailwind CSS**
- **Radix UI**
- **Supabase**
- **Generative AI / multimodal AI**
- **AI-assisted development tools**

> The stack was primarily implemented through an AI-assisted development workflow rather than traditional hand-coding.

---

# 🎯 What I Wanted to Explore

Order for Her gave me an opportunity to experiment with several product ideas at once.

### Persistent personalization

What happens when an AI experience remembers useful preferences instead of starting from zero every time?

### Multimodal interaction

Can something as ordinary as taking a picture of a menu become an input to a personalized AI experience?

### Context-aware recommendations

Can recommendations go beyond generic popularity and account for the person receiving the recommendation?

### Emotional utility

Can technology make someone appear a little more thoughtful by helping them remember and act on small details?

That final question is probably the most interesting part of the project for me.

---

# 🚀 Running Locally

## Requirements

Make sure you have:

- Node.js
- npm
- Git

installed.

### Clone the repository

```bash
git clone https://github.com/efter-dash/order-for-her.git
```

### Enter the project

```bash
cd order-for-her
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

---

# 🔐 Environment Variables

The application uses external services including Supabase.

Your local environment will therefore require the necessary configuration values.

Environment variables containing private credentials should **never be committed to the public repository**.

Only credentials specifically intended for client-side exposure, such as appropriate Supabase publishable keys, should ever reach the browser.

---

# 🔒 Privacy & Responsible Use

Order for Her can contain personal information about someone's preferences.

That may include:

- Food preferences
- Allergies
- Dietary restrictions
- Personal notes

Users should therefore avoid storing unnecessary sensitive information.

Food recommendations generated with AI should also be treated as assistance rather than a guarantee.

For allergies or serious dietary restrictions, users should always independently confirm ingredients with the restaurant before ordering.

---

# 🔮 Ideas for Future Development

Possible directions for the project include:

- Multiple taste profiles
- Couple / family profiles
- Preference learning over time
- Restaurant history
- Previous dish ratings
- “She loved this” feedback
- Smarter confidence scoring
- Location-aware restaurant discovery
- Shareable profiles
- Better menu recognition
- Restaurant links and digital menus
- Occasion-based recommendations
- Budget preferences
- Drink pairing
- Dessert recommendations
- Group dining recommendations

The project is still an experiment, so features and product direction may continue evolving.

---

# 🙋‍♂️ About the Builder

I'm **Efter Ahsan**.

My professional background is primarily in **marketing, creative work, partnerships, content and digital growth**, rather than traditional software engineering.

I'm interested in what becomes possible when people with ideas and domain understanding can use AI to build functional digital products without first becoming full-time developers.

I use AI-assisted development and vibe coding to explore that space.

My role in these projects is primarily to:

**identify → conceptualize → direct → test → refine → ship.**

Order for Her is one of those experiments.

### Connect

**GitHub:** [@efter-dash](https://github.com/efter-dash)

**Live Product:** [Order for Her](https://order-for-her.lovable.app)

---

## A Note on Vibe Coding

AI wrote a significant part of the underlying implementation of this project.

I'm intentionally transparent about that.

For me, the interesting skill isn't pretending the AI wasn't involved.

It's being able to take an idea from:

**“Wouldn't it be useful if…”**

to:

**a functional product someone can actually use.**

That requires defining the problem, shaping the experience, communicating requirements, evaluating what the AI builds, recognizing when it gets something wrong, iterating, and eventually shipping.

That's what this repository represents.
