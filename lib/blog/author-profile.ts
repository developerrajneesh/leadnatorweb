import { getDb } from "@/lib/db/mongodb";
import { SITE_NAME } from "@/lib/marketing-seo";

const SETTINGS_COLLECTION = "studio_settings";
const PROFILE_KEY = "blog_author_profile";

export type BlogAuthorProfile = {
  displayName: string;
  role: string;
  bio: string;
  avatarUrl: string;
  initials: string;
  updatedAt?: string;
};

export type ResolvedAuthor = BlogAuthorProfile;

const DEFAULT_PROFILE: BlogAuthorProfile = {
  displayName: "Leadnator Team",
  role: "Content & Growth",
  bio: `We write about WhatsApp marketing, CRM workflows, and growth strategies for businesses using ${SITE_NAME}.`,
  avatarUrl: "",
  initials: "LN",
};

async function settingsCollection() {
  const db = await getDb();
  const col = db.collection<{ key: string; value: string; updatedAt: string }>(SETTINGS_COLLECTION);
  await col.createIndex({ key: 1 }, { unique: true });
  return col;
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || "LN";
}

function normalizeProfile(input: Partial<BlogAuthorProfile>): BlogAuthorProfile {
  const displayName = (input.displayName || DEFAULT_PROFILE.displayName).trim().slice(0, 80);
  const role = (input.role || DEFAULT_PROFILE.role).trim().slice(0, 80);
  const bio = (input.bio || DEFAULT_PROFILE.bio).trim().slice(0, 500);
  const avatarUrl = (input.avatarUrl || "").trim().slice(0, 500);
  const initials = (input.initials || initialsFromName(displayName)).trim().slice(0, 3).toUpperCase();
  return { displayName, role, bio, avatarUrl, initials };
}

export async function getBlogAuthorProfile(): Promise<BlogAuthorProfile> {
  const col = await settingsCollection();
  const row = await col.findOne({ key: PROFILE_KEY }, { projection: { _id: 0, value: 1, updatedAt: 1 } });
  if (!row?.value) return { ...DEFAULT_PROFILE };
  try {
    const parsed = JSON.parse(row.value) as Partial<BlogAuthorProfile>;
    return { ...normalizeProfile(parsed), updatedAt: row.updatedAt };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export async function setBlogAuthorProfile(input: Partial<BlogAuthorProfile>): Promise<BlogAuthorProfile> {
  const profile = normalizeProfile(input);
  const col = await settingsCollection();
  const updatedAt = new Date().toISOString();
  await col.updateOne(
    { key: PROFILE_KEY },
    { $set: { key: PROFILE_KEY, value: JSON.stringify(profile), updatedAt } },
    { upsert: true },
  );
  return { ...profile, updatedAt };
}

/** Public author card — uses saved profile, with email-based fallback for name only. */
export async function resolveAuthorForPost(authorEmail: string): Promise<ResolvedAuthor> {
  const saved = await getBlogAuthorProfile();
  const email = authorEmail.trim().toLowerCase();
  const local = email.split("@")[0] || "";

  if (saved.avatarUrl || saved.displayName !== DEFAULT_PROFILE.displayName) {
    return saved;
  }

  if (/^admin$/i.test(local) || email.endsWith("@leadnator.com")) {
    return saved;
  }

  const name = local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    ...saved,
    displayName: name || saved.displayName,
    initials: initialsFromName(name || saved.displayName),
    role: saved.role || "Leadnator Team",
    bio: `${name || saved.displayName} writes about WhatsApp marketing, CRM workflows, and growth strategies for businesses using ${SITE_NAME}.`,
  };
}

export { DEFAULT_PROFILE };
