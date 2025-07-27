import type { ScheduleEntry } from "@/types/types";

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
  id: number;
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

export interface ClubWithRole {
  club: CreateClubResponse;
  role: "owner" | "admin" | "coach";
  is_owner: boolean;
}

export interface GetMyClubsResponse {
  clubs: ClubWithRole[];
  total: number;
  user_id: number;
}

export interface CreateClubStuffInvitationResponse {
  phone_number: string,
  role: string,
  club_id: number,
  id: number,
  created_by_id: number,
  is_used: boolean,
  created_at: string
}

export interface SectionClub {
  id:   number;
  name: string;
  city: string;
}

export interface SectionCoach {
  id:         number;
  first_name: string;
  last_name:  string;
  username:   string;
}

export interface CreateSectionResponse {
  id: number;
  club_id: number;
  name: string;
  description: string;
  coach_id: number;
  active: boolean;
  club: SectionClub;
  coach: SectionCoach;
  groups: SectionGroupSummary[];
  created_at: string;
  updated_at: string;
}

export interface SectionClub {
  id: number;
  name: string;
  city: string;
}

export interface SectionCoach {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

export interface SectionGroupSummary {
  id: number;
  name: string;
  level: string;
  capacity: number;
  price: number;
  active: boolean;
  enrolled_students: number;
}

export type GetMySectionsResponse = CreateSectionResponse[];

export interface CreateGroupResponse {
  section_id: number;
  name: string;
  description: string;
  schedule: ScheduleEntry;
  price: number;
  capacity: number;
  level: string;
  coach_id: number;
  tags: string[];
  active: boolean;
}

export interface GetMyGroupResponse {
  section_id: number;
  name: string;
  description: string;
  schedule: {
    [key: string]: unknown;
  };  price: number;
  capacity: number;
  level: string;
  coach_id: number;
  tags: string[];
  active: boolean;
  id: number;
  section: {
    id: number;
    name: string;
    club_id: number;
  };
  coach: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
  created_at: string;
  updated_at: string;
}

export type GetSectionGroupsResponse = GetMyGroupResponse[];

export interface Invitation {
  phone_number: string;
  role: string;
  club_id: number;
  club: SectionClub
  id: number;
  created_by_id: number;
  is_used: boolean;
  created_at: string;
  status: string;
}

export interface GetMyInvitationsResponse {
  invitations: Invitation[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface GetClubsLimitCheckResponse {
  can_create: boolean,
  current_clubs: number,
  max_clubs: number,
  remaining: number,
  reason: string
}

export interface ClubAndRole {
  club_id: number
  club_name: string
  role: "owner" | "admin" | "coach" 
  joined_at: string    
  is_active: boolean
  sections_count: number
}

export interface TeamMember {
  id: number
  telegram_id: number
  first_name: string
  last_name: string
  username: string
  phone_number: string
  photo_url: string
  created_at: string   
  updated_at: string   
  clubs_and_roles: ClubAndRole[]
}

export interface CurrentUserClub {
  club_id: number
  club_name: string
  user_role: "owner" | "admin" | "coach" // or string if roles vary
}

export interface GetTeamMembersResponse {
  staff_members: TeamMember[]
  total: number
  page: number
  size: number
  pages: number
  applied_filters: Record<string, unknown> | null
  current_user_clubs: CurrentUserClub[]
}
