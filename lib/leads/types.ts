export type LeadStatus = "new" | "contacted" | "closed";

export type ContactLead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  interest: string;
  message: string;
  source: "contact_form";
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ContactLeadInput = {
  name: string;
  email: string;
  company?: string;
  interest: string;
  message: string;
};

export type ContactLeadUpdate = {
  status?: LeadStatus;
  notes?: string;
};
