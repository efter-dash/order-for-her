export type SpiceLevel = 1 | 2 | 3 | 4;

export type PartnerProfile = {
  name: string;
  spice: SpiceLevel;
  cuisines: string[];
  dislikes: string[];
  allergies: string[];
  diet: string;
  vibe: string;
  notes: string;
  createdAt: string;
};

const KEY = "ofh.partner.profile.v1";

export function loadProfile(): PartnerProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PartnerProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: PartnerProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  localStorage.removeItem(KEY);
}

export const CUISINES = [
  "Italian", "Japanese", "Mexican", "Thai", "Indian",
  "Chinese", "French", "Mediterranean", "Korean", "American",
];

export const COMMON_DISLIKES = [
  "Cilantro", "Olives", "Mushrooms", "Blue cheese", "Anchovies",
  "Raw onion", "Bell peppers", "Pickles", "Truffle oil",
];

export const DIETS = ["No restriction", "Vegetarian", "Vegan", "Pescatarian", "Gluten-free"];

export const VIBES = [
  "Comfort food queen",
  "Adventurous foodie",
  "Healthy & light",
  "Sweet tooth",
  "Salty & savory",
];
