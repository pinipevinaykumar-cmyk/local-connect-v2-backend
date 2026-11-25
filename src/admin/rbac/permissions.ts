/** Single source of truth for permission keys and the default role matrix. */
export const PERMISSIONS = {
  'dashboard.view': 'View admin dashboard',
  'analytics.view': 'View analytics',
  'menus.manage': 'Create, edit, reorder and toggle menus',
  'homepage.manage': 'Edit homepage sections and banners',
  'features.manage': 'Toggle feature flags',
  'tournaments.manage': 'Manage tournaments, seasons, teams, players',
  'businesses.manage': 'Approve, verify, suspend and feature businesses',
  'categories.manage': 'Manage categories and subcategories',
  'users.manage': 'Edit, suspend, ban users and reset passwords',
  'roles.manage': 'Assign roles and edit role permissions',
  'cms.manage': 'Edit CMS pages',
  'ads.manage': 'Manage advertisements and campaigns',
  'notifications.send': 'Send notifications',
  'settings.manage': 'Edit platform settings',
  'audit.view': 'View audit logs',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
const ALL = Object.keys(PERMISSIONS) as PermissionKey[];

export const DEFAULT_ROLES: {
  key: string;
  name: string;
  permissions: PermissionKey[];
}[] = [
  { key: 'super_admin', name: 'Super Admin', permissions: ALL },
  {
    key: 'admin',
    name: 'Admin',
    permissions: ALL.filter((p) => p !== 'roles.manage' && p !== 'settings.manage'),
  },
  {
    key: 'moderator',
    name: 'Moderator',
    permissions: ['dashboard.view', 'businesses.manage', 'users.manage', 'audit.view'],
  },
  { key: 'business_owner', name: 'Business Owner', permissions: [] },
  {
    key: 'tournament_organizer',
    name: 'Tournament Organizer',
    permissions: ['dashboard.view', 'tournaments.manage', 'notifications.send'],
  },
  {
    key: 'event_organizer',
    name: 'Event Organizer',
    permissions: ['dashboard.view', 'notifications.send'],
  },
  { key: 'general_user', name: 'General User', permissions: [] },
];
