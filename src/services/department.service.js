'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditDepartment(payload, actor) {
    function timeStringToDate(timeStr) {
        // e.g. "09:00" → today's date with that time
        const [hours, minutes] = timeStr?.split(':').map(Number);
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
    }
    const {
        vdepid,
        vdepname,
        vtimein,
        vtimeout,
        vgracetimeperiod,
        vstatus,
        vtaskaccess
    } = payload;
    logger.info(vdepid,
        vdepname,
        vtimein,
        vtimeout,
        vgracetimeperiod,
        vstatus,
        vtaskaccess)
    return withConnection(async (conn) => {

        const result = await conn.execute(
            `BEGIN
        add_edit_department(
          :vdepid,
          :vdepname,
          :vtimein,
          :vtimeout,
          :vgracetimeperiod,
          :vstatus,
          :vtaskaccess,
          :vcreatedby,
          :vmessage
        );
      END;`,
            {
                vdepid: vdepid || null,
                vdepname,
                vtimein: timeStringToDate(vtimein),           //  Now a Date
                vtimeout: timeStringToDate(vtimeout),          //
                vgracetimeperiod: timeStringToDate(vgracetimeperiod),
                vstatus,
                vtaskaccess,
                vcreatedby: actor,

                //  FIX HERE
                vmessage: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.STRING,
                }
            }
        );
        logger.debug(result)

        const message = result?.outBinds?.vmessage;

        return { message };
    });
}

async function getDepartment() {
    logger.info('Fetching designation list');
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
            }
        );
        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows(); // fetch all rows
        await resultSet.close();
        logger.debug(rows);
        return rows.map(row => ({
            depid: row.DEPID,
            depname: row.DEPNAME,
            timein: row.TIMEIN,
            timeout: row.TIMEOUT,
            gracetimeperiod: row.GRACETIMEPERIOD,
            taskaccess: row.TASKACCESS,
            status: row.STATUS
        }));
    });
}

module.exports = {
    addEditDepartment,
    getDepartment
};