import ApiDocsPage from "./ApiDocsPage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/api-docs", ApiDocsPage);
export { metadata };
export default Page;
