const oracledb = require("oracledb");
const bcrypt = require("bcrypt");
const logger = require("../config/logger.js");
const { withConnection } = require("../database/oraclePool");

async function loginWeb(username, password) {
  return withConnection(async (conn) => {

    const result = await conn.execute(
      `BEGIN
        login_web(
          :vusername,
          :vpassword,
          :vuserid,
          :vempid,
          :vusername_o,
          :vpassword_o,
          :vroleid,
          :vrolename,
          :vmessage
        );
      END;`,
      {
        vusername: { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: username },
        vpassword: { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: password },
        vuserid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        vempid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        vusername_o: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        vpassword_o: { dir: oracledb.BIND_OUT, type: oracledb.STRING }, // 
        vroleid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        vrolename: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        vmessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      }
    );

    const {
      vuserid,
      vempid,
      vusername_o,
      vpassword_o,
      vroleid,
      vrolename,
      vmessage
    } = result.outBinds;

    // user not found or blocked
    if (!vuserid) {
      throw { status: 403, message: vmessage || "Invalid username or password" };
    }

    // IMPORTANT FIX: use vpassword_o instead of vmessage
    if (!vpassword_o) {
      throw { status: 500, message: "Password not returned from DB" };
    }

    const passwordMatch = await bcrypt.compare(password, vpassword_o);
    if (!passwordMatch) {
      throw { status: 403, message: "Invalid username or password" };
    }

    logger.info({
      event: "login_success",
      userid: vuserid,
      username: vusername_o
    });

    return {
      userid: vuserid,
      empid: vempid,
      username: vusername_o,
      roleid: vroleid,
      rolename: vrolename,
    };
  });
}

module.exports = { loginWeb };