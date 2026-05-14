'use strict';

/**
 * Logical permission keys stored in MODULES.PERMISSION_KEY (VARCHAR2).
 * RBAC middleware compares JWT role permissions against these keys.
 */
module.exports = {
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_PASSWORD_RESET: 'user:password_reset',
  USER_ACTIVATE: 'user:activate',
  ROLE_MANAGE: 'role:manage',
  MODULE_PERMISSION_MANAGE: 'module_permission:manage',
};
