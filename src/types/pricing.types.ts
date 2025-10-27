// src/types/pricing.types.ts

export type PackageType = 'single_group' | 'full_section' | 'multiple_groups' | 'multiple_sections' | 'full_club';
export type PaymentType = 'monthly' | 'yearly' | 'semi_annual' | 'session_pack';

export interface PricingPackage {
  id: string;
  name: string;
  type: PackageType;
  paymentType: PaymentType;
  price: number;
  sessionCount?: number;
  validityDays?: number;
  groupIds?: number[];
  sectionIds?: number[];
  clubId: number;
  active: boolean;
}

export interface Club {
  id: number;
  name: string;
  logo?: string;
  userRole: 'owner' | 'admin' | 'coach';
}

export interface Group {
  id: number;
  name: string;
  level?: string;
  capacity?: number;
  sectionId: number;
}
