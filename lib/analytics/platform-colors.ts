const KNOWN_PLATFORM_COLORS: Record<string, string> = {
  Direct: "#64748b",
  Google: "#4285f4",
  Instagram: "#e1306c",
  Facebook: "#1877f2",
  WhatsApp: "#25d366",
  LinkedIn: "#0a66c2",
  YouTube: "#ff0000",
  Twitter: "#1da1f2",
  TikTok: "#010101",
  Telegram: "#0088cc",
  Email: "#f59e0b",
  Social: "#8b5cf6",
  Other: "#94a3b8",
};

export function platformColor(name: string): string {
  if (KNOWN_PLATFORM_COLORS[name]) return KNOWN_PLATFORM_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 52%, 42%)`;
}
