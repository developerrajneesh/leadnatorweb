import SiteMapPage from "./SiteMapPage";
import { PageStructuredData } from "@/components/seo/StructuredData";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/site-map");

export default function Page() {
  return (
    <>
      <PageStructuredData path="/site-map" />
      <SiteMapPage />
    </>
  );
}
