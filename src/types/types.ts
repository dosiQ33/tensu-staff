export interface Staff {
  id: string;
  name: string;
  surname: string;
  telegramUsername?: string;
  role: 'coach' | 'admin' | 'head_coach' | 'assistant';
  sports: string[];
  groups: string[];
  phone?: string;
  status: 'active' | 'blocked' | 'vacation';
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
  groups: string[];
  sports: string[];
}

export interface NewStaff {
  name: string;
  surname: string;
  telegramUsername: string;
  role: string;
  sports: string[];
  groups: string[];
  phone: string;
}

export interface NewSection {
  name: string;
  description: string;
  telegramLink: string;
  coaches: string[];
}