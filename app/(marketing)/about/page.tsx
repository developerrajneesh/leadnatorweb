import AboutPage from "./AboutPage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/about", AboutPage);
export { metadata };
export default Page;
