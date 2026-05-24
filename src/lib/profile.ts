import { supabase } from "@/integrations/supabase/client";

export type SpiceLevel = 1 | 2 | 3 | 4;

export type PartnerProfile = {
  id?: string;
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

// ---------- localStorage (guest tier) ----------

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
    const single = loadProfile();
    return single ? [single] : [];
  } catch {
    return [];
  }
}

export function saveProfileLocal(p: PartnerProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
  const list = loadProfiles();
  const idx = list.findIndex((x) => x.name.toLowerCase() === p.name.toLowerCase());
  if (idx >= 0) list[idx] = p;
  else list.push(p);
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function clearProfile() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(LIST_KEY);
}

export function wouldExceedFreeLimit(name: string): boolean {
  const list = loadProfiles();
  if (list.length < FREE_PROFILE_LIMIT) return false;
  const isExisting = list.some((p) => p.name.trim().toLowerCase() === name.trim().toLowerCase());
  return !isExisting;
}

// ---------- Supabase (signed-in tier) ----------

export async function isSignedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export async function saveProfileRemote(p: PartnerProfile): Promise<PartnerProfile> {
  const { data: sess } = await supabase.auth.getSession();
  const uid = sess.session?.user.id;
  if (!uid) throw new Error("Not signed in");

  const row = {
    user_id: uid,
    name: p.name,
    spice: p.spice,
    cuisines: p.cuisines,
    dislikes: p.dislikes,
    allergies: p.allergies,
    diet: p.diet,
    vibe: p.vibe,
    notes: p.notes,
  };

  if (p.id) {
    const { data, error } = await supabase
      .from("partner_profiles")
      .update(row)
      .eq("id", p.id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return rowToProfile(data);
  }

  const { data, error } = await supabase
    .from("partner_profiles")
    .insert(row)
    .select()
    .maybeSingle();
  if (error) throw error;
  return rowToProfile(data);
}

export async function loadProfilesRemote(): Promise<PartnerProfile[]> {
  const { data, error } = await supabase
    .from("partner_profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToProfile);
}

// Hybrid save: if signed in -> remote, else -> local (with free limit)
export async function saveProfile(p: PartnerProfile): Promise<PartnerProfile> {
  if (await isSignedIn()) {
    const saved = await saveProfileRemote(p);
    saveProfileLocal(saved); // keep local cache for scan flow
    return saved;
  }
  saveProfileLocal(p);
  return p;
}

function rowToProfile(r: any): PartnerProfile {
  return {
    id: r.id,
    name: r.name,
    spice: r.spice as SpiceLevel,
    cuisines: r.cuisines ?? [],
    dislikes: r.dislikes ?? [],
    allergies: r.allergies ?? [],
    diet: r.diet ?? "No restriction",
    vibe: r.vibe ?? "",
    notes: r.notes ?? "",
    createdAt: r.created_at,
  };
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
