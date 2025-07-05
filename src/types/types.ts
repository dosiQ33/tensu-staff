export interface Staff {
  id: number;
  name: string;
  surname: string;
  telegramUsername?: string;
  role: 'coach' | 'admin';
  sports: string[];
  clubs: string[];
  phone?: string;
  status: 'active' | 'pending' | 'vacation' | 'blocked';
}

export interface SportsSection {
  id: string;
  name: string;
  icon: string;
  description: string;
  telegramLink: string;
  coaches: string[];
  color: string;
}

export interface Filters {
  search: string;
  roles: string[];
  clubs: string[];
  sections: string[];
}

export interface NewStaff {
  role: string;
  phone: string;
  clubId: string;   
}

export interface NewSection {
  id?: number;
  club_id?: number;
  name: string;
  description?: string;
  coach_id?: number;
  active?: boolean;
  club?: {
    id: number;
    name: string;
    city: string;
  };
  coach?: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
  groups?: {
    schedule: never[];
    id: number;
    name: string;
    level: string;
    capacity: number;
    price: string;
    active: boolean;
    enrolled_students: number;
  }[];
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleEntry {
  day: string;
  start: string;
  end: string;
}

export interface NewGroup {
  section_id?: number;
  name: string;
  description?: string;
  schedule?: Record<string, unknown>;
  price: number;
  capacity: number;
  level: string;
  coach_id?: number;
  tags?: string[];
  active?: boolean;
}
