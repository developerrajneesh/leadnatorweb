import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db/mongodb";
import type {
  PartnerApplication,
  PartnerApplicationInput,
  PartnerApplicationStatus,
  PartnerApplicationUpdate,
} from "./types";

const COLLECTION = "partner_applications";

const STATUSES: PartnerApplicationStatus[] = ["new", "reviewing", "approved", "declined"];

async function collection() {
  const db = await getDb();
  const col = db.collection<PartnerApplication>(COLLECTION);
  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ createdAt: -1 });
  await col.createIndex({ email: 1 });
  return col;
}

function normalizeInput(input: PartnerApplicationInput): PartnerApplicationInput {
  return {
    name: input.name.trim().slice(0, 200),
    phone: input.phone.trim().slice(0, 40),
    email: input.email.trim().toLowerCase().slice(0, 320),
    company: input.company.trim().slice(0, 200),
    reason: input.reason.trim().slice(0, 5000),
  };
}

export async function createPartnerApplication(
  input: PartnerApplicationInput,
): Promise<PartnerApplication> {
  const data = normalizeInput(input);
  const row: PartnerApplication = {
    id: uuidv4(),
    ...data,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  const col = await collection();
  await col.insertOne(row);
  return row;
}

export async function listPartnerApplications(limit = 200): Promise<PartnerApplication[]> {
  const col = await collection();
  const rows = await col
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return rows.map((r) => normalizeRow(r as PartnerApplication));
}

export async function getPartnerApplication(id: string): Promise<PartnerApplication | null> {
  const col = await collection();
  const row = await col.findOne({ id }, { projection: { _id: 0 } });
  if (!row) return null;
  return normalizeRow(row as PartnerApplication);
}

export async function updatePartnerApplication(
  id: string,
  patch: PartnerApplicationUpdate,
): Promise<PartnerApplication | null> {
  const col = await collection();
  const update: Partial<PartnerApplication> = { updatedAt: new Date().toISOString() };

  if (patch.status !== undefined) {
    if (!STATUSES.includes(patch.status)) return null;
    update.status = patch.status;
  }
  if (patch.notes !== undefined) {
    update.notes = patch.notes.trim().slice(0, 2000);
  }

  const result = await col.findOneAndUpdate(
    { id },
    { $set: update },
    { returnDocument: "after", projection: { _id: 0 } },
  );

  if (!result) return null;
  return normalizeRow(result as PartnerApplication);
}

export async function deletePartnerApplication(id: string): Promise<boolean> {
  const col = await collection();
  const result = await col.deleteOne({ id });
  return result.deletedCount === 1;
}

function normalizeRow(row: PartnerApplication): PartnerApplication {
  return { ...row, status: row.status ?? "new" };
}
