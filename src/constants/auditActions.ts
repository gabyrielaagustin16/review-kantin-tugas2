export const AUDIT_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE_MENU: 'CREATE_MENU',
  UPDATE_MENU: 'UPDATE_MENU',
  DELETE_MENU: 'DELETE_MENU',
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];
