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
  extra: Record<string, unknown>;
}

export interface CreateStuffInvitationRequest {
  phone_number: string;
  role: string;
}

export interface CreateSectionRequest {
  club_id:      number;
  name:         string;
  level:        'beginner' | 'intermediate' | 'advanced';
  capacity:     number;
  price:        number;
  duration_min: number;
  coach_id:     number;
  tags:         string[];
  schedule:     Record<string, unknown>;
  active:       boolean;
}