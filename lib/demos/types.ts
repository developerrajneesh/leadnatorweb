export type DemoBookingStatus = "new" | "scheduled" | "completed" | "cancelled";

export const DEMO_PRODUCTS = ["AI Voice Agents", "VoIP Calling", "Both"] as const;
export type DemoProduct = (typeof DEMO_PRODUCTS)[number];

export type DemoBooking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  industry: string;
  product: DemoProduct;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  source: string;
  status: DemoBookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};

export type DemoBookingInput = {
  name: string;
  phone: string;
  email: string;
  company: string;
  industry: string;
  product: DemoProduct;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  source: string;
};

export type DemoBookingUpdate = {
  status?: DemoBookingStatus;
  notes?: string;
};
