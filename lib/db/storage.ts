import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const env = (key: string) => process.env[key]?.trim() ?? "";

function s3Client() {
  const endpoint = env("ENDPOINT_URL");
  const accessKeyId = env("ACCESS_KEY_ID");
  const secretAccessKey = env("SECRET_ACCESS_KEY");

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Supabase storage credentials are not configured");
  }

  return new S3Client({
    forcePathStyle: true,
    region: env("REGION") || "us-east-1",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

function bucketName() {
  const bucket = env("BUCKET_NAME");
  if (!bucket) throw new Error("BUCKET_NAME is not configured");
  return bucket;
}

/** Public URL for objects uploaded via Supabase S3-compatible API */
export function publicObjectUrl(key: string) {
  const customBase = env("SUPABASE_PUBLIC_BASE_URL");
  if (customBase) {
    return `${customBase.replace(/\/$/, "")}/${key}`;
  }

  const endpoint = env("ENDPOINT_URL");
  const match = endpoint.match(/https:\/\/([^.]+)\.storage\.supabase\.co/);
  const projectRef = match?.[1];
  if (!projectRef) {
    throw new Error("Could not derive Supabase public URL — set SUPABASE_PUBLIC_BASE_URL");
  }

  return `https://${projectRef}.supabase.co/storage/v1/object/public/${bucketName()}/${key}`;
}

async function bodyToText(body: unknown): Promise<string | null> {
  if (!body) return null;
  if (typeof body === "string") return body.trim() || null;
  if (body instanceof Uint8Array) return Buffer.from(body).toString("utf8").trim() || null;
  if (Buffer.isBuffer(body)) return body.toString("utf8").trim() || null;
  if (typeof body === "object" && body !== null) {
    const stream = body as { transformToString?: () => Promise<string>; text?: () => Promise<string> };
    if (typeof stream.transformToString === "function") {
      return (await stream.transformToString()).trim() || null;
    }
    if (typeof stream.text === "function") {
      return (await stream.text()).trim() || null;
    }
  }
  return null;
}

async function readS3ErrorBody(err: unknown): Promise<string | null> {
  if (!err || typeof err !== "object") return null;

  const candidates = [
    (err as { $response?: { body?: unknown } }).$response?.body,
    (err as { $metadata?: unknown }).$metadata,
  ];

  for (const body of candidates) {
    const text = await bodyToText(body);
    if (text && !text.startsWith("<") && text.length < 500) return text;
  }

  return null;
}

function humanizeStorageError(body: string): string {
  const lower = body.toLowerCase();
  if (lower.includes("project paused")) {
    return "Supabase project is paused. Go to supabase.com → your project → Restore / Unpause, then upload again.";
  }
  if (lower.includes("bucket not found") || lower.includes("nosuchbucket")) {
    return `Storage bucket "${bucketName()}" was not found. Create it in Supabase Storage and set BUCKET_NAME in .env.`;
  }
  if (lower.includes("access denied") || lower.includes("invalidaccesskeyid") || lower.includes("signature")) {
    return "Supabase storage credentials are invalid. Regenerate S3 keys in Supabase → Storage → S3 Connection.";
  }
  return body.slice(0, 280);
}

export async function formatUploadError(err: unknown): Promise<string> {
  const body = await readS3ErrorBody(err);
  if (body) return humanizeStorageError(body);

  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("Deserialization error") || message.includes("char 'P' is not expected")) {
    return "Supabase project is paused or storage is unavailable. Unpause your project at supabase.com/dashboard, then try again.";
  }
  if (message.includes("not configured")) return message;
  return message || "Upload failed";
}

export async function uploadBlogImage(
  buffer: Buffer,
  contentType: string,
  ext: string,
): Promise<string> {
  const key = `blog/${uuidv4()}.${ext}`;

  try {
    const client = s3Client();
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName(),
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return publicObjectUrl(key);
  } catch (err) {
    throw new Error(await formatUploadError(err));
  }
}
