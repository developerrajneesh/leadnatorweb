import PartnersPage from "./PartnersPage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/partners", PartnersPage);
export { metadata };
export default Page;
