import RefundPolicyPage from "./RefundPolicyPage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/refund-policy", RefundPolicyPage);
export { metadata };
export default Page;
