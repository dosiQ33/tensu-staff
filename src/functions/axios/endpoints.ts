export const ENDPOINTS = {
  STUFF: {
    BASE:        '/staff/',
    BY_ID:       (userId: string) => `/staff/${userId}`,
    ME:          '/staff/me/',
    PREFERENCES: '/staff/preferences',
    PREFERENCE:  (telegramId: string, key: string) =>
                  `/staff/${telegramId}/preferences/${key}`,
  },

  CLUBS: {
    BASE:          '/clubs/',
    MY:            '/clubs/my',
    BY_ID:         (clubId: string) => `/clubs/${clubId}`,
    UPDATE:        (clubId: string) => `/clubs/${clubId}`,
    CHECK_PERMISSION: (clubId: string) => `/clubs/${clubId}/check-permission`,
  },

  STUDENTS: {
    BASE:        '/students/',
    BY_ID:       (userId: string) => `/students/${userId}`,
    BY_TELEGRAM: (telegramId: string) => `/students/by-telegram-id/${telegramId}`,
    PREFERENCES: '/students/preferences',
    PREFERENCE:  (telegramId: string, key: string) =>
                   `/students/${telegramId}/preferences/${key}`,
  },

  SECTIONS: {
    BASE:         '/sections/',
    CLUB:         (clubId: string) => `/sections/club/${clubId}`,
    COACH:        (coachId: string) => `/sections/coach/${coachId}`,
    MY:           '/sections/my',
    BY_ID:        (sId: string) => `/sections/${sId}`,
    TOGGLE:       (sId: string) => `/sections/${sId}/toggle-status`,
    STATS:        (sId: string) => `/sections/${sId}/stats`,
  },
} as const;