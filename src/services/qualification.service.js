'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditQalify(payload, actor) {

    const { vqualificaid, vqualificaname, vstatus } = payload;

    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                add_edit_qualification(
                    :vqualificaid,
                    :vqualificaname,
                    :vstatus,
                    :vcreatedby,
                    :vmessage
                );
            END;`,
            {
                vqualificaid: vqualificaid || null,
                vqualificaname,
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
async function getQualification() {
    logger.info('Fetching designation list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_qualification(:retval);
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
            qualificaid: row.QUALIFICAID,
            qualificaname: row.QUALIFICANAME,
            status: row.STATUS
        }));
    });
}

module.exports = {
    addEditQalify,
    getQualification
};