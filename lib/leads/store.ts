import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db/mongodb";
import type { ContactLead, ContactLeadInput } from "./types";

const LEADS_COLLECTION = "contact_leads";
const SETTINGS_COLLECTION = "studio_settings";
const WEBHOOK_KEY = "leads_webhook_url";

async function leadsCollection() {
  const db = await getDb();
  const col = db.collection<ContactLead>(LEADS_COLLECTION);
  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ createdAt: -1 });
  await col.createIndex({ email: 1 });
  return col;
}

async function settingsCollection() {
  const db = await getDb();
  const col = db.collection<{ key: string; value: string; updatedAt: string }>(SETTINGS_COLLECTION);
  await col.createIndex({ key: 1 }, { unique: true });
  return col;
}

function normalizeInput(input: ContactLeadInput): ContactLeadInput {
  return {
    name: input.name.trim().slice(0, 200),
    email: input.email.trim().toLowerCase().slice(0, 320),
    company: input.company?.trim().slice(0, 200) || undefined,
    interest: input.interest.trim().slice(0, 120) || "Other",
    message: input.message.trim().slice(0, 5000),
  };
}

export async function createContactLead(input: ContactLeadInput): Promise<ContactLead> {
  const data = normalizeInput(input);
  const lead: ContactLead = {
    id: uuidv4(),
    ...data,
    source: "contact_form",
    createdAt: new Date().toISOString(),
  };
  const col = await leadsCollection();
  await col.insertOne(lead);
  return lead;
}

export async function listContactLeads(limit = 200): Promise<ContactLead[]> {
  const col = await leadsCollection();
  const rows = await col
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return rows as ContactLead[];
}

export async function deleteContactLead(id: string): Promise<boolean> {
  const col = await leadsCollection();
  const result = await col.deleteOne({ id });
  return result.deletedCount === 1;
}

export async function getLeadsWebhookUrl(): Promise<string | null> {
  const col = await settingsCollection();
  const row = await col.findOne({ key: WEBHOOK_KEY }, { projection: { _id: 0, value: 1 } });
  const url = row?.value?.trim();
  return url || null;
}

export async function setLeadsWebhookUrl(url: string): Promise<string | null> {
  const trimmed = url.trim();
  if (!trimmed) {
    const col = await settingsCollection();
    await col.deleteOne({ key: WEBHOOK_KEY });
    return null;
  }
  const col = await settingsCollection();
  await col.updateOne(
    { key: WEBHOOK_KEY },
    { $set: { key: WEBHOOK_KEY, value: trimmed, updatedAt: new Date().toISOString() } },
    { upsert: true },
  );
  return trimmed;
}

export async function dispatchLeadsWebhook(lead: ContactLead): Promise<void> {
  const url = await getLeadsWebhookUrl();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "contact.lead.created",
        submittedAt: lead.createdAt,
        data: {
          name: lead.name,
          email: lead.email,
          company: lead.company ?? "",
          interest: lead.interest,
          message: lead.message,
          source: lead.source,
        },
      }),
    });
  } catch (err) {
    console.error("[leads] webhook dispatch failed:", err);
  }
}
