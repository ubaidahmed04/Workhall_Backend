'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditRole(payload, actor) {
    const {
        vroleid,
        vrolename,
        vstatus
    } = payload;

    return withConnection(async (conn) => {

        const result = await conn.execute(
            `BEGIN
                add_edit_userrole(
                    :vroleid,
                    :vrolename,
                    :vstatus,
                    :vcreatedby,
                    :vmessage
                );
            END;`,
            {
                vroleid: vroleid || null,
                vrolename,
                vstatus,
                vcreatedby: actor,
                vmessage: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.STRING
                }
            }
        );

        logger.debug(result);
        const message = result?.outBinds?.vmessage;
        return {
            message
        };
    });
}

async function getRole() {
    logger.info('Fetching designation list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_userrole(:retval);
            END;`,
            {
                retval: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );
        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows(); // fetch all rows
        await resultSet.close();
        logger.debug(rows);
        return rows.map(row => ({
            roleid: row.ROLEID,
            rolename: row.ROLENAME,
            status: row.STATUS
        }));
    });
}

module.exports = {
    addEditRole,
    getRole
};