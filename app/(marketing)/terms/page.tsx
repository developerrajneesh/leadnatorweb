import TermsPage from "./TermsPage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/terms", TermsPage);
export { metadata };
export default Page;
