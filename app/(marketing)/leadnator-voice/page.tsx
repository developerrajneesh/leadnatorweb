import LeadnatorVoicePage from "./LeadnatorVoicePage";
import { defineMarketingPage } from "@/lib/marketing-page";

const { metadata, Page } = defineMarketingPage("/leadnator-voice", LeadnatorVoicePage);
export { metadata };
export default Page;
