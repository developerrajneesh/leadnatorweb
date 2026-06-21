/** Skip Next.js optimizer for legacy /uploads paths only (old posts). Cloud URLs use remotePatterns. */
export function shouldUnoptimizeImage(url: string) {
  return url.startsWith("/uploads/");
}
