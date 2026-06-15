'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addTask(payload, actorId) {
    const {
        vtaskid, vfk_client, vdescription, vfk_taskdocid, vtaskdoc,
        vfk_tasktypeid, vassignto, vteammembers, vfk_branchid,
        vfk_priorityid, vfk_taskstatusid, vduedate, vclientreview,
        vtaskreview, vimagestatus, vstatus, vcomplainby
    } = payload;

    // logger.debug(payload);
    // logger.info("yaha tk aya he");

    return withConnection(async (conn) => {
        const result = await conn.execute(
            `
            BEGIN
                add_edit_task(
                    :vtaskid, :vfk_client, :vdescription, :vfk_taskdocid, :vtaskdoc,
                    :vfk_tasktypeid, :vassignto, :vteammembers, :vfk_branchid,
                    :vfk_priorityid, :vfk_taskstatusid, :vduedate, :vclientreview,
                    :vtaskreview, :vimagestatus, :vstatus, :vcomplainby, :vuserby, :vmessage
                );
            END;
            `,
            {
                vtaskid: vtaskid ? Number(vtaskid) : null,
                vfk_client: vfk_client ? Number(vfk_client) : null,
                vdescription: vdescription || null,
                vfk_taskdocid: vfk_taskdocid ? Number(vfk_taskdocid) : null,
                vtaskdoc: vtaskdoc || null,
                vfk_tasktypeid: vfk_tasktypeid ? Number(vfk_tasktypeid) : null,
                vassignto: vassignto || null,
                vteammembers: vteammembers || null,
                vfk_branchid: vfk_branchid ? Number(vfk_branchid) : null,
                vfk_priorityid: vfk_priorityid ? Number(vfk_priorityid) : null,
                vfk_taskstatusid: vfk_taskstatusid ? Number(vfk_taskstatusid) : null,
                vduedate: vduedate ? new Date(vduedate) : null,
                vclientreview: vclientreview || null,
                vtaskreview: vtaskreview || null,
                vimagestatus: vimagestatus !== undefined ? Number(vimagestatus) : 0,
                vstatus: vstatus !== undefined ? Number(vstatus) : 0,
                vcomplainby: vcomplainby || null,
                vuserby: actorId,
                vmessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
            },
            { autoCommit: true }
        );

        const msg = result?.outBinds?.vmessage ?? "";

        if (msg.startsWith("Error:")) {
            logger.error({ procedureError: msg });
            return { status: false, message: msg };
        }

        return { status: true, message: msg };
    });
}

async function getAllTask(payload = {}) {
    const {
        vfromdate,
        vtodate,
        vempid,
        vtaskstatus
    } = payload;

    return withConnection(async (conn) => {
        const result = await conn.execute(
            `
            BEGIN
                get_task(
                    :vfromdate,
                    :vtodate,
                    :vempid,
                    :vtaskstatus,
                    :vretval
                );
            END;
            `,
            {
                vfromdate: vfromdate
                    ? new Date(vfromdate)
                    : null,

                vtodate: vtodate
                    ? new Date(vtodate)
                    : null,

                vempid: vempid
                    ? Number(vempid)
                    : null,

                vtaskstatus: vtaskstatus
                    ? Number(vtaskstatus)
                    : null,

                vretval: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );

        const rs = result.outBinds.vretval;
        const rows = await rs.getRows();
        await rs.close();

        return rows.map((row) => ({
            taskid: row.TASKID,

            fk_branchid: row.FK_BRANCHID,
            branchname: row.BRANCHNAME,

            fk_clientid: row.FK_CLIENTID,
            clientname: row.CLIENTNAME,

            description: row.DESCRIPTION,

            fk_taskdocid: row.FK_TASKDOCID,
            image: row.IMAGE,

            fk_tasktypeid: row.FK_TASKTYPEID,
            tasktypename: row.TASKTYPENAME,

            assignto: row.ASSIGNTO,
            teammembers: row.TEAMMEMBERS,
            employee_names: row.EMPLOYEE_NAMES,

            fk_priorityid: row.FK_PRIORITYID,
            priorityname: row.PRIORITYNAME,

            fk_taskstatusid: row.FK_TASKSTATUSID,
            taskstatusname: row.TASKSTATUSNAME,

            duedate: row.DUEDATE,
            completedate: row.COMPLETEDATE,

            client_review: row.CLIENT_REVIEW,
            task_review: row.TASK_REVIEW,

            complainby: row.COMPLAINBY,
            complaindate: row.COMPLAINDATE,

            status: row.STATUS,

            createby: row.CREATEBY,
            createdate: row.CREATEDATE,

            lastupdateby: row.LASTUPDATEBY,
            lastupdate: row.LASTUPDATE
        }));
    });
}

async function getTaskStatus() {
    logger.info('Fetching Task Status');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN get_task_status(:retval); END;`,
            { retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
        );
        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows();
        await resultSet.close();
        logger.debug(rows);
        
        return rows.map(row => ({
            taskstatusid: row.TASKSTATUSID,
            taskstatusname: row.TASKSTATUSNAME,
            status: row.STATUS
        }));
    });
}

async function getPriority() {
    logger.info('Fetching Priority list');
    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN get_priority(:retval); END;`,
            { retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
        );

        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows();
        await resultSet.close();
        logger.debug(rows);

        return rows.map(row => ({
            priorityid: row.PRIORITYID,
            priorityname: row.PRIORITYNAME,
            status: row.STATUS
        }));
    });
}

module.exports = {
    addTask,
    getTaskStatus,
    getPriority,
    getAllTask
};