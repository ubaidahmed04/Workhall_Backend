'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditProject(payload, actor) {
    const { vprojectid, vprojectname, vstatus } = payload;

    logger.info({ vprojectid, vprojectname, vstatus, actor });

    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN add_edit_project(:vprojectid, :vprojectname, :vstatus, :vcreatedby, :vmessage); END;`,
            {
                vprojectid: vprojectid || null,
                vprojectname,
                vstatus,
                vcreatedby: "admin ",
                vmessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            }
        );

        logger.debug(result);
        return { message: result?.outBinds?.vmessage };
    });
}

async function getProject() {
    logger.info('Fetching Project list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN get_Project(:retval); END;`,
            { retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
        );

        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows();
        await resultSet.close();
        logger.debug(rows);

        return rows.map(row => ({
            projectid: row.PROJECTID,
            projectname: row.PROJECTNAME,
            status: row.STATUS
        }));
    });
}

module.exports = {
    addEditProject,
    getProject
};