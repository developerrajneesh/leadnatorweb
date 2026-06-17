import HomePage from "./HomePage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/", HomePage);
export { metadata };
export default Page;
