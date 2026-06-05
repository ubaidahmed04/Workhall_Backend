'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditShifts(payload, actor) {
    function timeStringToDate(timeStr) {
        // e.g. "09:00" → today's date with that time
        const [hours, minutes] = timeStr?.split(':').map(Number);
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
    }
    const {
        vshiftid,
        vshiftname,
        vtimein,
        vtimeout,
        vgracetimeperiod,
        vstatus,
        vtaskaccess
    } = payload;
    logger.info(vshiftid,
        vshiftname,
        vtimein,
        vtimeout,
        vgracetimeperiod,
        vstatus,
        vtaskaccess)
    return withConnection(async (conn) => {

        const result = await conn.execute(
            `BEGIN
        add_edit_shift(
          :vshiftid,
          :vshiftname,
          :vtimein,
          :vtimeout,
          :vgracetimeperiod,
          :vstatus,
          :vcreatedby,
          :vmessage
        );
      END;`,
            {
                vshiftid: vshiftid || null,
                vshiftname,
                vtimein: new Date(vtimein),           //  Now a Date
                vtimeout: new Date(vtimeout),          //
                vgracetimeperiod: new Date(vgracetimeperiod),
                vstatus,
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

async function getShift() {
    logger.info('Fetching shift list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_shift(:retval);
            END;`,
            {
                retval: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }, {
                // MISTAKE FIXED: Is option se hum row.SHIFTID ki tarah data parh sakte hain
                outFormat: oracledb.OUT_FORMAT_OBJECT 
            }
        );
        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows(); // fetch all rows
        await resultSet.close();
        logger.debug(rows);
        console.log(rows)
        return rows.map(row => ({
            shiftid: row.SHIFTID,
            shiftname: row.SHIFTNAME,
            timein: row.TIMEIN,
            timeout: row.TIMEOUT,
            gracetimeperiod: row.GRACETIMEPERIOD,
            status: row.STATUS
        }));
    });
}

module.exports = {
    addEditShifts,
    getShift
};