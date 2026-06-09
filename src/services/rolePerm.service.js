const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");
const logger = require("../config/logger");

async function addEditRoleWithPermissions(body, actorId) {
  const {
    roleid,
    rolename,
    status,
    permissions = []
  } = body;

  return withConnection(async (conn) => {

    const ModulePermTableClass =
      await conn.getDbObjectClass("MODULE_PERM_TABLE");

    const modulePermCollection = new ModulePermTableClass(
      permissions.map((item) => ({
        MODULEPERMID: item.modulepermid || null,
        FK_ROLEID: null,
        FK_MODULEID: Number(item.fk_moduleid),
        PERMISSION: item.permission,
        STATUS: item.status ?? 0,
        CREATEDBY: actorId,
        EDITBY: null
      }))
    );

    const result = await conn.execute(
      `
      BEGIN
        add_edit_role_with_perms(
          :vroleid,
          :vrolename,
          :vstatus,
          :vcreatedby,
          :vpermission,
          :vmessage
        );
      END;
      `,
      {
        vroleid: roleid || null,
        vrolename: rolename,
        vstatus: status ?? 0,
        vcreatedby: actorId,

        vpermission: modulePermCollection,

        vmessage: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 1000
        }
      },
      {
        autoCommit: true
      }
    );

    logger.debug(result);

    return {
      status: true,
      message: result.outBinds.vmessage
    };
  });
}

async function getRolePermissions(roleId) {
  logger.info(`Fetching permissions for role: ${roleId}`);

  return withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_role_permissions(
          :vroleid,
          :retval
        );
      END;
      `,
      {
        vroleid: Number(roleId),
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR
        }
      }
    );

    const resultSet = result.outBinds.retval;

    const rows = await resultSet.getRows(0);

    await resultSet.close();

    return rows?.map((row) => ({
      modulepermid: row.MODULEPERMID,
      fk_roleid: row.FK_ROLEID,
      fk_moduleid: row.FK_MODULEID,
      modulename: row.MODULENAME,
      permission: row.PERMISSION,
      status: row.STATUS
    }));
  });
}

async function getModules() {
  logger.info("Fetching modules");

  return withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_modules(:retval);
      END;
      `,
      {
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR
        }
      }
    );

    const resultSet = result.outBinds.retval;

    const rows = await resultSet.getRows(0);

    await resultSet.close();

    return rows?.map((row) => ({
      moduleid: row.MODULEID,
      modulename: row.MODULENAME,
      platform: row.PLATFORM,
      status: row.STATUS,
      createdby: row.CREATEDBY,
      editby: row.EDITBY
    }));
  });
}
module.exports = {
  addEditRoleWithPermissions,
  getModules,
  getRolePermissions
};