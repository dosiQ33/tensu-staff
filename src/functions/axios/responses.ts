export interface StuffPreferences {
  [key: string]: Record<string, unknown>;
}

export interface CreateStuffResponse {
  telegram_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  username: string;
  photo_url: string;
  preferences: StuffPreferences;
  created_at: string;
  updated_at: string;
}
