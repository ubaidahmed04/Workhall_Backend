'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditDesig(payload, actor) {

    const {
        vdesignid,
        vdesigname,
        vstatus
    } = payload;

    logger.info({
        vdesignid,
        vdesigname,
        vstatus,
        actor
    });

    return withConnection(async (conn) => {

        const result = await conn.execute(
            `BEGIN
                add_edit_designation(
                    :vdesignid,
                    :vdesigname,
                    :vstatus,
                    :vcreatedby,
                    :vmessage
                );
            END;`,
            {
                vdesignid: vdesignid || null,
                vdesigname,
                vstatus,
                vcreatedby: "admin ",

                // OUT parameter (IMPORTANT FIX)
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

async function getDesignation() {
    logger.info('Fetching designation list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_designation(:retval);
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
            designid: row.DESIGNID,
            designame: row.DESIGNAME,
            status: row.STATUS
        }));
    });
}


module.exports = {
    addEditDesig,
    getDesignation
};