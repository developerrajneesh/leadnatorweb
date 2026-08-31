export type PartnerApplicationStatus = "new" | "reviewing" | "approved" | "declined";

export type PartnerApplication = {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  reason: string;
  status: PartnerApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};

export type PartnerApplicationInput = {
  name: string;
  phone: string;
  email: string;
  company: string;
  reason: string;
};

export type PartnerApplicationUpdate = {
  status?: PartnerApplicationStatus;
  notes?: string;
};
