'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addBranch(payload, actor) {

    const toNumberOrNull = (v) =>
        v === "" || v === undefined || v === null
            ? null
            : Number(v);

    const {
        vbranchid,
        vbranchname,
        vlocation,
        vfloors,
        vlongitude,
        vlatitude,
        vradius,
        vstatus
    } = payload;

    return withConnection(async (conn) => {

        const result = await conn.execute(
            `BEGIN
                add_edit_branch(
                    :vbranchid,
                    :vbranchname,
                    :vlocation,
                    :vfloors,
                    :vlongitude,
                    :vlatitude,
                    :vradius,
                    :vstatus,
                    :vcreatedby,
                    :vmessage
                );
            END;`,
            {
                vbranchid: toNumberOrNull(vbranchid),
                vbranchname: vbranchname || null,
                vlocation: vlocation || null,
                vfloors: toNumberOrNull(vfloors),
                vlongitude: toNumberOrNull(vlongitude),
                vlatitude: toNumberOrNull(vlatitude),
                vradius: toNumberOrNull(vradius),
                vstatus: vstatus !== undefined ? Number(vstatus) : 0,
                vcreatedby: actor,
                vmessage: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.STRING,
                    maxSize: 500
                }
            },
            {
                autoCommit: true
            }
        );

        logger.debug(result);
        const message = result?.outBinds?.vmessage;
        return message
    });
}

async function getBranches() {

    logger.info('Fetching branches list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_branch(:retval);
            END;`,
            {
                retval: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );

        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows();
        await resultSet.close();
        logger.debug(rows);

        return rows.map(row => ({
            branchid: row.BRANCHID,
            branchname: row.BRANCHNAME,
            location: row.LOCATION,
            floors: row.FLOORS,
            longitude: row.LONGITUDE,
            latitude: row.LATITUDE,
            radius: row.RADIUS,
            status: row.STATUS,
            createdby: row.CREATEDBY,
            editby: row.EDITBY
        }));
    });
}

module.exports = {
    addBranch,
    getBranches
};