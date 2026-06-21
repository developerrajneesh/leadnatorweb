import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db/mongodb";

export type StudioAdmin = {
  email: string;
  passwordHash: string;
  role: "admin";
  createdAt: string;
  updatedAt: string;
};

const COLLECTION = "studio_admins";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function adminsCollection() {
  const db = await getDb();
  const col = db.collection<StudioAdmin>(COLLECTION);
  await col.createIndex({ email: 1 }, { unique: true });
  return col;
}

export async function ensureDefaultAdmin() {
  const col = await adminsCollection();
  const count = await col.countDocuments();
  if (count > 0) return;

  const email = normalizeEmail(process.env.BLOG_ADMIN_EMAIL?.trim() || "admin@leadnator.com");
  const password = process.env.BLOG_ADMIN_PASSWORD?.trim() || "Leadnator@2026";
  const now = new Date().toISOString();

  await col.insertOne({
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });
}

export async function verifyStudioAdmin(email: string, password: string): Promise<boolean> {
  await ensureDefaultAdmin();
  const col = await adminsCollection();
  const admin = await col.findOne({ email: normalizeEmail(email) });
  if (!admin) return false;
  return bcrypt.compare(password, admin.passwordHash);
}

export async function createStudioAdmin(email: string, password: string) {
  await ensureDefaultAdmin();
  const col = await adminsCollection();
  const normalized = normalizeEmail(email);
  const existing = await col.findOne({ email: normalized });
  if (existing) {
    throw new Error("Admin with this email already exists");
  }

  const now = new Date().toISOString();
  await col.insertOne({
    email: normalized,
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateStudioAdminPassword(email: string, password: string) {
  const col = await adminsCollection();
  const result = await col.updateOne(
    { email: normalizeEmail(email) },
    {
      $set: {
        passwordHash: await bcrypt.hash(password, 12),
        updatedAt: new Date().toISOString(),
      },
    },
  );
  return result.matchedCount > 0;
}
