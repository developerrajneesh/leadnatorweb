import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db/mongodb";
import type {
  DemoBooking,
  DemoBookingInput,
  DemoBookingStatus,
  DemoBookingUpdate,
} from "./types";

const COLLECTION = "demo_bookings";

const STATUSES: DemoBookingStatus[] = ["new", "scheduled", "completed", "cancelled"];

async function collection() {
  const db = await getDb();
  const col = db.collection<DemoBooking>(COLLECTION);
  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ createdAt: -1 });
  await col.createIndex({ email: 1 });
  return col;
}

function normalizeInput(input: DemoBookingInput): DemoBookingInput {
  return {
    name: input.name.trim().slice(0, 200),
    phone: input.phone.trim().slice(0, 40),
    email: input.email.trim().toLowerCase().slice(0, 320),
    company: input.company.trim().slice(0, 200),
    industry: input.industry.trim().slice(0, 80),
    product: input.product,
    preferredDate: input.preferredDate.trim().slice(0, 10),
    preferredTime: input.preferredTime.trim().slice(0, 40),
    message: input.message?.trim().slice(0, 2000) || undefined,
    source: input.source.trim().slice(0, 80) || "website",
  };
}

export async function createDemoBooking(input: DemoBookingInput): Promise<DemoBooking> {
  const data = normalizeInput(input);
  const row: DemoBooking = {
    id: uuidv4(),
    ...data,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  const col = await collection();
  await col.insertOne(row);
  return row;
}

export async function listDemoBookings(limit = 300): Promise<DemoBooking[]> {
  const col = await collection();
  const rows = await col
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return rows.map((r) => normalizeRow(r as DemoBooking));
}

export async function getDemoBooking(id: string): Promise<DemoBooking | null> {
  const col = await collection();
  const row = await col.findOne({ id }, { projection: { _id: 0 } });
  if (!row) return null;
  return normalizeRow(row as DemoBooking);
}

export async function updateDemoBooking(
  id: string,
  patch: DemoBookingUpdate,
): Promise<DemoBooking | null> {
  const col = await collection();
  const update: Partial<DemoBooking> = { updatedAt: new Date().toISOString() };

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
  return normalizeRow(result as DemoBooking);
}

export async function deleteDemoBooking(id: string): Promise<boolean> {
  const col = await collection();
  const result = await col.deleteOne({ id });
  return result.deletedCount === 1;
}

function normalizeRow(row: DemoBooking): DemoBooking {
  return { ...row, status: row.status ?? "new" };
}
