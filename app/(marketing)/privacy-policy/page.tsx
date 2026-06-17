import PrivacyPolicyPage from "./PrivacyPolicyPage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/privacy-policy", PrivacyPolicyPage);
export { metadata };
export default Page;
