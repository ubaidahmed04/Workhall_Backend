'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditDepartment(payload, actor) {

  
    const {
        vdepid,
        vdepname,
        vstatus,
        vtaskaccess
    } = payload;

    logger.info(`Processing department modification: ID=${vdepid || 'NEW'}, Name=${vdepname}`);

    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                add_edit_department(
                  :vdepid,
                  :vdepname,
                  :vstatus,
                  :vtaskaccess,
                  :vcreatedby,
                  :vmessage
                );
             END;`,
            {
                vdepid: vdepid || null,
                vdepname: vdepname || null,
                vstatus: vstatus !== undefined ? vstatus : 0,
                vtaskaccess: vtaskaccess !== undefined ? vtaskaccess : 0,
                vcreatedby: actor,
                vmessage: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.STRING,
                }
            }
        );

        logger.debug(result);
        const message = result?.outBinds?.vmessage;
        return { message };
    });
}

async function getDepartment() {
    logger.info('Fetching department list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_department(:retval);
             END;`,
            {
                retval: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT 
            }
        );

        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows(); 
        await resultSet.close();
        
        logger.debug(rows);

        return rows.map(row => ({
            depid: row.DEPID,
            depname: row.DEPNAME,
            taskaccess: row.TASKACCESS,
            status: row.STATUS
        }));
    });
}

module.exports = {
    addEditDepartment,
    getDepartment
};