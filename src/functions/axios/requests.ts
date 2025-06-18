export interface StaffPreferences {
  [key: string]: Record<string, unknown>;
}

export interface CreateStaffRequest {
  contact_init_data: string;
  preferences: StaffPreferences;
}

export interface CreateClubRequest {
  name: string;
  description: string;
  city: string;
  address: string;
  logo_url: string;
  cover_url: string;
  phone: string;
  telegram_url: string;
  instagram_url: string;
  // timezone: string;  
  // currency: string;   
  extra: Record<string, unknown>;
}