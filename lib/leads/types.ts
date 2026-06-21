export type ContactLead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  interest: string;
  message: string;
  source: "contact_form";
  createdAt: string;
};

export type ContactLeadInput = {
  name: string;
  email: string;
  company?: string;
  interest: string;
  message: string;
};
