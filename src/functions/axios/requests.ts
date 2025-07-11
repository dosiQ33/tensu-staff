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
  club_id?: number;
  name: string;
  description: string;
  coach_id?: number | null;
  active: boolean;
}

export interface CreateGroupRequest {
  section_id: number | undefined;
  name: string;
  description: string;
  schedule: Record<string, unknown>;
  price: number;
  capacity: number;
  level: string;
  coach_id: number;
  tags: string[];
  active: boolean;
}
