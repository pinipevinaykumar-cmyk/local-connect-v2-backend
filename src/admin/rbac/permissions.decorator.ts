import { SetMetadata } from '@nestjs/common';
import { PermissionKey } from './permissions';

export const PERMISSIONS_KEY = 'required_permissions';
/** Require ALL listed permissions. Use together with JwtAuthGuard + PermissionsGuard. */
export const RequirePermissions = (...perms: PermissionKey[]) =>
  SetMetadata(PERMISSIONS_KEY, perms);
