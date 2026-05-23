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
const LIST_KEY = "ofh.partner.profiles.v1";

export const FREE_PROFILE_LIMIT = 1;

export function loadProfile(): PartnerProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PartnerProfile) : null;
  } catch {
    return null;
  }
}

export function loadProfiles(): PartnerProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (raw) return JSON.parse(raw) as PartnerProfile[];
    // Back-compat: migrate single profile
    const single = loadProfile();
    return single ? [single] : [];
  } catch {
    return [];
  }
}

export function saveProfile(p: PartnerProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
  const list = loadProfiles();
  const existingIdx = list.findIndex((x) => x.name.toLowerCase() === p.name.toLowerCase());
  if (existingIdx >= 0) list[existingIdx] = p;
  else list.push(p);
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function clearProfile() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(LIST_KEY);
}

/**
 * True if saving this profile would exceed the free tier (1 profile).
 * Editing the existing free profile (same name) is always allowed.
 */
export function wouldExceedFreeLimit(name: string): boolean {
  const list = loadProfiles();
  if (list.length < FREE_PROFILE_LIMIT) return false;
  const isExisting = list.some((p) => p.name.trim().toLowerCase() === name.trim().toLowerCase());
  return !isExisting;
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
