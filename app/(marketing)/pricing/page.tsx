import PricingPage from "./PricingPage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/pricing", PricingPage);
export { metadata };
export default Page;
