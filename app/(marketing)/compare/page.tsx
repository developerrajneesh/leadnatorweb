import ComparePage from "./ComparePage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/compare", ComparePage);
export { metadata };
export default Page;
