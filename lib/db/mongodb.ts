import { Db, MongoClient } from "mongodb";

const env = (key: string) => process.env[key]?.trim() ?? "";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  return env("MONGO_URI") || env("MONGODB_URI");
}

export function getDbName() {
  const uri = getMongoUri();
  if (!uri) return "Leadnator";
  try {
    const pathname = new URL(uri).pathname.replace(/^\//, "");
    return pathname || "Leadnator";
  } catch {
    return "Leadnator";
  }
}

function createClientPromise() {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("MONGO_URI is not configured");
  }

  const client = new MongoClient(uri);
  return client.connect();
}

export function getMongoClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createClientPromise();
    }
    return global._mongoClientPromise;
  }
  return createClientPromise();
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(getDbName());
}
