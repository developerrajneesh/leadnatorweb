/**
 * Seed one sample published blog post into MongoDB
 * Run: npm run seed:post
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";

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

const SAMPLE_POST = {
  slug: "auto-reply-whatsapp-without-losing-leads",
  title: "How to Auto-Reply on WhatsApp Without Losing Leads",
  excerpt:
    "Instant replies build trust — but generic bots kill conversions. Here is a simple framework to automate WhatsApp without sounding robotic.",
  tags: ["whatsapp", "automation", "crm"],
  content: {
    time: Date.now(),
    version: "2.31.6",
    blocks: [
      {
        id: randomUUID(),
        type: "paragraph",
        data: {
          text: "Most teams turn on WhatsApp auto-reply and hope for the best. The result? Fast first messages, but flat reply rates and leads that go cold by day two.",
        },
      },
      {
        id: randomUUID(),
        type: "header",
        data: { text: "1. Reply in under 60 seconds — with context", level: 2 },
      },
      {
        id: randomUUID(),
        type: "paragraph",
        data: {
          text: "Speed matters, but context matters more. Your first reply should confirm what the lead asked for and set a clear next step — book a call, share pricing, or collect one key detail.",
        },
      },
      {
        id: randomUUID(),
        type: "list",
        data: {
          style: "unordered",
          items: [
            "Acknowledge the lead source (Ad, website, referral)",
            "Ask one qualifying question only",
            "Offer a human handoff when needed",
          ],
        },
      },
      {
        id: randomUUID(),
        type: "header",
        data: { text: "2. Use follow-up sequences, not one-shot messages", level: 2 },
      },
      {
        id: randomUUID(),
        type: "paragraph",
        data: {
          text: "A single auto-reply is not a system. Plan 2–3 follow-ups over 72 hours for silent leads. Keep each message short and value-focused.",
        },
      },
      {
        id: randomUUID(),
        type: "quote",
        data: {
          text: "Automation should protect your team’s time — not replace relationship building.",
          caption: "Leadnator Team",
          alignment: "left",
        },
      },
      {
        id: randomUUID(),
        type: "header",
        data: { text: "3. Track every lead in one CRM pipeline", level: 2 },
      },
      {
        id: randomUUID(),
        type: "paragraph",
        data: {
          text: "If replies live in personal phones and spreadsheets, you cannot scale. Move every WhatsApp lead into one pipeline with owner, stage, and next action.",
        },
      },
      {
        id: randomUUID(),
        type: "warning",
        data: {
          title: "Common mistake",
          message:
            "Broadcasting the same promo message to all contacts usually increases blocks and reduces delivery quality.",
        },
      },
      {
        id: randomUUID(),
        type: "paragraph",
        data: {
          text: 'Want one place for WhatsApp Cloud API, auto-replies, and CRM follow-ups? Start free at <a href="https://app.leadnator.com/signup">app.leadnator.com/signup</a>.',
        },
      },
    ],
  },
};

async function main() {
  await loadEnvFile();

  const mongoUri = env("MONGO_URI") || env("MONGODB_URI");
  if (!mongoUri) throw new Error("MONGO_URI is not set in .env");

  const author = (env("BLOG_ADMIN_EMAIL") || "admin@leadnator.com").toLowerCase();
  const now = new Date().toISOString();

  const client = new MongoClient(mongoUri);
  await client.connect();
  const col = client.db(getDbName(mongoUri)).collection("blog_posts");
  await col.createIndex({ slug: 1 }, { unique: true });

  const existing = await col.findOne({ slug: SAMPLE_POST.slug });
  if (existing) {
    console.log(`Post already exists: /blog/${SAMPLE_POST.slug}`);
    await client.close();
    return;
  }

  const post = {
    id: randomUUID(),
    slug: SAMPLE_POST.slug,
    title: SAMPLE_POST.title,
    excerpt: SAMPLE_POST.excerpt,
    coverImage: undefined,
    content: SAMPLE_POST.content,
    status: "published",
    author,
    tags: SAMPLE_POST.tags,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };

  await col.insertOne(post);
  await client.close();

  console.log("Sample post published:");
  console.log(`  Title: ${post.title}`);
  console.log(`  URL:   http://localhost:3000/blog/${post.slug}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
