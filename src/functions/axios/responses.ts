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
