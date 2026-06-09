const oracledb = require("oracledb");
const bcrypt = require("bcrypt");
const logger = require("../config/logger.js");
const { withConnection } = require("../database/oraclePool");

async function loginWeb(username, password) {
  return withConnection(async (conn) => {

    const result = await conn.execute(
      `BEGIN
        login_web(
          :vusername, :vpassword,
          :vuserid, :vempid, :vusername_o, :vpassword_o,
          :vroleid, :vrolename, :vmessage, :vpermissions
        );
      END;`,
      {
        vusername: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
        vpassword: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: password },
        vuserid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        vempid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        vusername_o: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        vpassword_o: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        vroleid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        vrolename: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        vmessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
        vpermissions: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },  // naya
      }
    );

    const {
      vuserid, vempid, vusername_o, vpassword_o,
      vroleid, vrolename, vmessage, vpermissions
    } = result.outBinds;

    if (!vuserid) {
      const err = new Error(vmessage || "Invalid username or password");
      err.status = 401;
      throw err;
    }

    if (!vpassword_o) {
      if (vpermissions) await vpermissions.close();
      throw { status: 500, message: "Password not returned from DB" };
    }

    const passwordMatch = await bcrypt.compare(password, vpassword_o);
    if (!passwordMatch) {
      if (vpermissions) await vpermissions.close();
      throw { status: 403, message: "Invalid username or password" };
    }

    // Permissions rows fetch karo
    const permRows = await vpermissions.getRows(0);  // 0 = sab rows
    await vpermissions.close();

    const permissions = permRows.map((row) => ({
      modulepermid: row.MODULEPERMID,
      moduleid: row.FK_MODULEID,
      modulename: row.MODULENAME,
      platform: row.PLATFORM,
      permission: row.PERMISSION,
    }));

    return {
      userid: vuserid,
      empid: vempid,
      username: vusername_o,
      roleid: vroleid,
      rolename: vrolename,
      permissions: permissions,  // naya
    };
  });
}

module.exports = { loginWeb };