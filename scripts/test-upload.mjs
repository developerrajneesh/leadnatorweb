import { readFileSync } from "node:fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

for (const line of readFileSync(".env", "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq === -1) continue;
  const k = t.slice(0, eq).trim();
  const v = t.slice(eq + 1).trim();
  if (!process.env[k]) process.env[k] = v;
}

async function bodyToText(body) {
  if (!body) return null;
  if (typeof body === "string") return body.trim() || null;
  if (body instanceof Uint8Array) return Buffer.from(body).toString("utf8").trim() || null;
  if (Buffer.isBuffer(body)) return body.toString("utf8").trim() || null;
  if (typeof body?.transformToString === "function") return (await body.transformToString()).trim() || null;
  return null;
}

async function formatUploadError(err) {
  const body = await bodyToText(err?.$response?.body);
  if (body?.toLowerCase().includes("project paused")) {
    return "Supabase project is paused. Go to supabase.com → Restore / Unpause.";
  }
  const message = err?.message || "";
  if (message.includes("Deserialization error") || message.includes("char 'P'")) {
    return "Supabase project is paused or storage unavailable. Unpause at supabase.com/dashboard.";
  }
  return body || message || "Upload failed";
}

const client = new S3Client({
  forcePathStyle: true,
  region: "us-east-1",
  endpoint: process.env.ENDPOINT_URL.trim(),
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID.trim(),
    secretAccessKey: process.env.SECRET_ACCESS_KEY.trim(),
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

try {
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME.trim(),
      Key: "blog/test-upload.txt",
      Body: Buffer.from("test"),
      ContentType: "text/plain",
    }),
  );
  console.log("SUCCESS");
} catch (e) {
  console.log("USER MESSAGE:", await formatUploadError(e));
}
