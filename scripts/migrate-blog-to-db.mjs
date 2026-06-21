/**
 * One-time migration: posts.json + local uploads → MongoDB + Supabase Storage
 * Run: npm run migrate:blog
 */
import { readFile, readdir, unlink, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function env(key) {
  return process.env[key]?.trim() ?? "";
}

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env");
  return readFile(envPath, "utf-8")
    .then((raw) => {
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    })
    .catch(() => {});
}

function getDbName(uri) {
  try {
    const pathname = new URL(uri).pathname.replace(/^\//, "");
    return pathname || "Leadnator";
  } catch {
    return "Leadnator";
  }
}

function publicObjectUrl(key) {
  const customBase = env("SUPABASE_PUBLIC_BASE_URL");
  if (customBase) return `${customBase.replace(/\/$/, "")}/${key}`;

  const endpoint = env("ENDPOINT_URL");
  const match = endpoint.match(/https:\/\/([^.]+)\.storage\.supabase\.co/);
  if (!match) throw new Error("Set SUPABASE_PUBLIC_BASE_URL or ENDPOINT_URL");
  return `https://${match[1]}.supabase.co/storage/v1/object/public/${env("BUCKET_NAME")}/${key}`;
}

function s3Client() {
  return new S3Client({
    forcePathStyle: true,
    region: env("REGION") || "ap-south-1",
    endpoint: env("ENDPOINT_URL"),
    credentials: {
      accessKeyId: env("ACCESS_KEY_ID"),
      secretAccessKey: env("SECRET_ACCESS_KEY"),
    },
  });
}

const mimeByExt = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

async function uploadLocalFile(relativeUrl, cache) {
  if (!relativeUrl.startsWith("/uploads/")) return relativeUrl;
  if (cache.has(relativeUrl)) return cache.get(relativeUrl);

  const localPath = path.join(ROOT, "public", relativeUrl.replace(/^\//, ""));
  try {
    await access(localPath);
  } catch {
    console.warn(`  skip missing file: ${relativeUrl}`);
    return relativeUrl;
  }

  const buffer = await readFile(localPath);
  const ext = path.extname(localPath).slice(1).toLowerCase() || "jpg";
  const key = `blog/${randomUUID()}.${ext}`;
  const client = s3Client();

  await client.send(
    new PutObjectCommand({
      Bucket: env("BUCKET_NAME"),
      Key: key,
      Body: buffer,
      ContentType: mimeByExt[ext] || "application/octet-stream",
    }),
  );

  const url = publicObjectUrl(key);
  cache.set(relativeUrl, url);
  console.log(`  uploaded ${relativeUrl} → ${url}`);
  return url;
}

async function rewriteUrls(value, cache) {
  if (typeof value === "string" && value.startsWith("/uploads/")) {
    return uploadLocalFile(value, cache);
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => rewriteUrls(item, cache)));
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = await rewriteUrls(v, cache);
    }
    return out;
  }
  return value;
}

async function seedAdmin(db) {
  const col = db.collection("studio_admins");
  const count = await col.countDocuments();
  if (count > 0) {
    console.log("Admin already exists in MongoDB");
    return;
  }
  const email = (env("BLOG_ADMIN_EMAIL") || "admin@leadnator.com").toLowerCase();
  const password = env("BLOG_ADMIN_PASSWORD") || "Leadnator@2026";
  const now = new Date().toISOString();
  await col.insertOne({
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });
  await col.createIndex({ email: 1 }, { unique: true });
  console.log(`Seeded admin: ${email}`);
}

async function main() {
  await loadEnvFile();

  const mongoUri = env("MONGO_URI") || env("MONGODB_URI");
  if (!mongoUri) throw new Error("MONGO_URI is required");
  if (!env("ENDPOINT_URL") || !env("ACCESS_KEY_ID") || !env("BUCKET_NAME")) {
    throw new Error("Supabase storage env vars are required");
  }

  const postsPath = path.join(ROOT, "data", "blog", "posts.json");
  let posts = [];
  try {
    posts = JSON.parse(await readFile(postsPath, "utf-8"));
  } catch {
    console.log("No posts.json found — skipping post migration");
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(getDbName(mongoUri));
  const postsCol = db.collection("blog_posts");

  await seedAdmin(db);
  await postsCol.createIndex({ id: 1 }, { unique: true });
  await postsCol.createIndex({ slug: 1 }, { unique: true });

  const urlCache = new Map();
  let migrated = 0;

  for (const post of posts) {
    const existing = await postsCol.findOne({ id: post.id });
    if (existing) {
      console.log(`Skip existing post: ${post.title}`);
      continue;
    }

    const coverImage = post.coverImage
      ? await uploadLocalFile(post.coverImage, urlCache)
      : post.coverImage;
    const content = await rewriteUrls(post.content, urlCache);

    await postsCol.insertOne({
      ...post,
      coverImage: coverImage || undefined,
      content,
    });
    migrated += 1;
    console.log(`Migrated post: ${post.title}`);
  }

  // Remove local data files after successful migration
  if (posts.length > 0) {
    await writeFileSafe(postsPath, "[]\n");
    console.log("Cleared data/blog/posts.json");
  }

  const uploadDir = path.join(ROOT, "public", "uploads", "blog");
  try {
    const files = await readdir(uploadDir);
    for (const file of files) {
      if (file === ".gitkeep") continue;
      await unlink(path.join(uploadDir, file));
      console.log(`Removed local upload: ${file}`);
    }
  } catch {
    /* no upload dir */
  }

  await client.close();
  console.log(`\nDone. Migrated ${migrated} post(s) to MongoDB.`);
}

async function writeFileSafe(filePath, data) {
  const { writeFile } = await import("node:fs/promises");
  await writeFile(filePath, data, "utf-8");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
