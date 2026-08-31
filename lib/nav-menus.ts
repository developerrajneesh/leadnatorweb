export type NavDropdownItem = {
  label: string;
  href: string;
};

export const FEATURE_NAV_ITEMS: NavDropdownItem[] = [
  { label: "WhatsApp Business API", href: "/features#whatsapp" },
  { label: "WhatsApp Cloud API", href: "/features#whatsapp" },
  { label: "Meta Ads", href: "/features#meta" },
  { label: "Instagram Automations", href: "/features#instagram" },
  { label: "Email Marketing", href: "/features#email" },
  { label: "Leads CRM", href: "/features#crm" },
  { label: "Calendar & Booking", href: "/features#calendar" },
  { label: "AI Studio", href: "/features#ai" },
  { label: "Dashboard & Analytics", href: "/features#dashboard" },
  { label: "File Storage", href: "/features#storage" },
  { label: "Growth Tools", href: "/features#tools" },
  { label: "In-app Support", href: "/features#support" },
  { label: "Integrations", href: "/features#integrations" },
  { label: "Visual Automations", href: "/features#automation" },
];

export const PARTNER_NAV_ITEMS: NavDropdownItem[] = [
  { label: "Become a Partner", href: "/partners#become" },
  { label: "View Partners", href: "/partners" },
];
