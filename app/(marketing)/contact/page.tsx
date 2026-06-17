import ContactPage from "./ContactPage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/contact", ContactPage);
export { metadata };
export default Page;
