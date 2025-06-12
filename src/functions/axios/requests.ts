export interface StaffPreferences {
  [key: string]: Record<string, unknown>;
}

export interface CreateStaffRequest {
  contact_init_data: string;
  preferences: StaffPreferences;
}
