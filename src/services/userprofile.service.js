const oracledb = require("oracledb");
const bcrypt = require("bcrypt");
const { withConnection } = require("../database/oraclePool");
const logger = require("../config/logger");

async function addEditUserProfile(payload, actor) {
    const toNumberOrNull = (v) =>
  v === "" || v === undefined || v === null ? null : Number(v);
    const {
        vuserid,
        vusername,
        vpassword,
        vfk_empid,
        vfk_clientid,
        vfk_userroleid,
        vweb_access,
        vblockstatus,
        vloginstatus,
        vstatus
    } = payload;


    // ================= PASSWORD ENCRYPTION =================

    let hashedPassword = null;
    if (vpassword?.trim()) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(vpassword, saltRounds);
    }

    return withConnection(async (conn) => {

        const result = await conn.execute(
            `BEGIN
                add_edit_userprofile(
                    :vuserid,
                    :vusername,
                    :vusereny,
                    :vfk_empid,
                    :vfk_clientid,
                    :vfk_userroleid,
                    :vweb_access,
                    :vblockstatus,
                    :vloginstatus,
                    :vstatus,
                    :vcreatedby,
                    :vmessage
                );
            END;`,
            {
                vuserid: toNumberOrNull(vuserid),
                vusername,
                vusereny: hashedPassword,
                vfk_empid: toNumberOrNull(vfk_empid),
                vfk_clientid: toNumberOrNull(vfk_clientid),
                vfk_userroleid: toNumberOrNull(vfk_userroleid),
                vweb_access: Number(vweb_access || 0),
                vblockstatus: Number(vblockstatus || 0),
                vloginstatus: Number(vloginstatus || 0),
                vstatus: Number(vstatus || 0),
                vcreatedby: actor,
                vmessage: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.STRING
                }
            }
        );

        logger.debug(result);

        return {
            message: result?.outBinds?.vmessage
        };
    });
}

async function getUsersProfile() {

    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_userproile(:retval);
            END;`,
            {
                retval: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );
        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows(500); // all rows
        await resultSet.close();
        return rows.map(row => ({
            userid: row.USERID,
            username: row.USERNAME,
            client: row.FK_CLIENTID,
            employee: row.FK_EMPID,
            userrole: row.FK_USERROLEID,
            roleName: row.ROLENAME,
            loginStatus: row.LOGINSTATUS,
            blockStatus: row.BLOCKSTATUS,
            webaccess: row.WEB_ACCESS,
            status: row.STATUS
        }));
    });
}

module.exports = {
    addEditUserProfile,
    getUsersProfile
};