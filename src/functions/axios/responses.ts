export interface StaffPreferences {
  [key: string]: Record<string, unknown>;
}

export interface CreateStaffResponse {
  telegram_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  username: string;
  photo_url: string;
  preferences: StaffPreferences;
  created_at: string;
  updated_at: string;
}

export interface ClubOwner {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

export interface CreateClubResponse {
  id: number;
  owner_id: number;
  owner: ClubOwner;
  name: string;
  description: string;
  city: string;
  address: string;
  logo_url: string;
  cover_url: string;
  phone: string;
  telegram_url: string;
  instagram_url: string;
  timezone: string;
  currency: string;
  extra: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type GetMyClubsResponse = CreateClubResponse[];