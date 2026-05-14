'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditHoliday(payload, actor) {

    const {
        vholidayid,
        vfromdate,
        vtodate,
        vdescrip,
        vstatus
    } = payload;

    logger.info({
        vholidayid,
        vfromdate,
        vtodate,
        vdescrip,
        vstatus,
        actor
    });

    return withConnection(async (conn) => {

        const result = await conn.execute(
            `BEGIN
                add_edit_holiday(
                    :vholidayid,
                    :vfromdate,
                    :vtodate,
                    :vdescrip,
                    :vstatus,
                    :vcreatedby,
                    :vmessage
                );
            END;`,
            {
                vholidayid: vholidayid || null,

                // Oracle DATE
                vfromdate: new Date(vfromdate),
                vtodate: new Date(vtodate),
                vdescrip,
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

async function getHoliday() {
    logger.info('Fetching Holiday list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_holiday(:retval);
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
            holidayid: row.HOLIDAYID,
            fromdate: row.FROMDATE,
            todate: row.TODATE,
            holidayname: row.DESCRIPTION,
            status: row.STATUS
        }));
    });
}

module.exports = {
    addEditHoliday,
    getHoliday
};