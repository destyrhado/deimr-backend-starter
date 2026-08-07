export const USER_ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = 'USER';
