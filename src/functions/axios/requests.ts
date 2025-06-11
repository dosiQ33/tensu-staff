export interface StuffPreferences {
  [key: string]: Record<string, unknown>;
}

export interface CreateStuffRequest {
  contact_init_data: string;
  preferences: StuffPreferences;
}
