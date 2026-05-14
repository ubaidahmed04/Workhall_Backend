'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditEmp(payload, actor) {

    const {
        vskillid,
        vskillname,
        vstatus
    } = payload;

    return withConnection(async (conn) => {

        const result = await conn.execute(
            `BEGIN
                add_edit_skill(
                    :vskillid,
                    :vskillname,
                    :vstatus,
                    :vcreatedby,
                    :vmessage
                );
            END;`,
            {
                vskillid: vskillid || null,
                vskillname,
                vstatus,
                // logged in user
                vcreatedby: actor,
                // OUT parameter
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

async function getEmployees() {
    logger.info('Fetching Emp list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_skills(:retval);
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
            skillid: row.SKILLID,
            skillname: row.SKILLNAME,
            status: row.STATUS
        }));
    });
}


module.exports = {
    addEditEmp,
    getEmployees
};