/**
 * Seed studio admin into MongoDB from .env
 * Run: npm run seed:admin
 * Force reset password: npm run seed:admin -- --force
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function env(key) {
  return process.env[key]?.trim() ?? "";
}

async function loadEnvFile() {
  const envPath = path.join(ROOT, ".env");
  try {
    const raw = await readFile(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.warn("No .env file found — using process env only");
  }
}

function getDbName(uri) {
  try {
    const pathname = new URL(uri).pathname.replace(/^\//, "");
    return pathname || "Leadnator";
  } catch {
    return "Leadnator";
  }
}

async function main() {
  await loadEnvFile();

  const force = process.argv.includes("--force");
  const mongoUri = env("MONGO_URI") || env("MONGODB_URI");
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in .env");
  }

  const email = (env("BLOG_ADMIN_EMAIL") || "admin@leadnator.com").toLowerCase();
  const password = env("BLOG_ADMIN_PASSWORD") || "Leadnator@2026";
  const now = new Date().toISOString();

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(getDbName(mongoUri));
  const col = db.collection("studio_admins");
  await col.createIndex({ email: 1 }, { unique: true });

  const existing = await col.findOne({ email });

  if (existing && !force) {
    console.log(`Admin already exists: ${email}`);
    console.log("Use --force to reset password from .env");
    await client.close();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    await col.updateOne(
      { email },
      { $set: { passwordHash, updatedAt: now } },
    );
    console.log(`Password reset for admin: ${email}`);
  } else {
    await col.insertOne({
      email,
      passwordHash,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Admin seeded: ${email}`);
  }

  await client.close();
  console.log("Done. Login at /studio/login");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
