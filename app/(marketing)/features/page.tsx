import FeaturesPage from "./FeaturesPage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/features", FeaturesPage);
export { metadata };
export default Page;
