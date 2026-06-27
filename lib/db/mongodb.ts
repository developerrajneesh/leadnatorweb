import { Db, MongoClient } from "mongodb";
import * as dns from "node:dns";

// Atlas "mongodb+srv://" URIs need to resolve _mongodb._tcp SRV records. On some
// networks/ISPs the system resolver fails (querySrv ECONNREFUSED). Force a public
// resolver (Google DNS) + IPv4-first — mirrors the backend's config/db.js.
dns.setDefaultResultOrder("ipv4first");
const DNS_SERVERS = (process.env.DNS_SERVERS || "8.8.8.8,8.8.4.4")
  .split(",")
  .map((s) => s.trim().replace(/^["']|["']$/g, ""))
  .filter(Boolean);
if (DNS_SERVERS.length) {
  try {
    dns.setServers(DNS_SERVERS);
    if (dns.promises && typeof dns.promises.setServers === "function") {
      dns.promises.setServers(DNS_SERVERS);
    }
  } catch {
    /* non-fatal — fall back to system DNS */
  }
}

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

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    family: 4, // force IPv4 — avoids slow/failing IPv6 lookups on some networks
  });
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
