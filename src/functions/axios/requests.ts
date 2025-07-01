export interface StaffPreferences {
  [key: string]: Record<string, unknown>;
}

export interface CreateStaffRequest {
  contact_init_data: string;
  preferences: StaffPreferences;
}

export interface UpdateStaffRequest {
  first_name: string;
  last_name?: string;
  username?: string;
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
}

export interface CreateStuffInvitationRequest {
  phone_number: string;
  role: string;
}

export interface CreateSectionRequest {
  club_id?:      number;
  name:         string;
  level:       string;
  capacity?:     number;
  price?:        number;
  coach_id?:    number | null;
  tags?:         string[];
  schedule?:     Record<string, { start: string; end: string }[]>;
  active:       boolean;
}