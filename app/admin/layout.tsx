import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/blog.css";

const studioFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--studio-font",
  display: "swap",
});

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className={`studio-root ${studioFont.variable}`}>{children}</div>;
}
