const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GET TASK REPORT
 * =====================================
 */
exports.getTaskReport = async (req, res) => {
  try {
    console.log(" GET TASK REPORT REQUEST:", req.body);

    const { fromdate, todate, empid, taskstatus } = req.body;

    await withConnection(async (conn) => {

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
        vfromdate: fromdate ? new Date(fromdate) : null,

        vtodate: todate ? new Date(todate) : null,

        vempid: empid === undefined ? null : empid,

        vtaskstatus: taskstatus === undefined ? null : taskstatus,

        vretval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    const resultSet = result.outBinds.vretval;

    const rows = await resultSet.getRows(100000);

    await resultSet.close();

    console.log("📦 TASK REPORT ROWS:", rows.length);

    const formattedRows = rows.map((row) => ({
      taskid: row.TASKID,
      branchid: row.FK_BRANCHID,
      branchname: row.BRANCHNAME,

      clientid: row.FK_CLIENTID,
      clientname: row.CLIENTNAME,

      description: row.DESCRIPTION,

      taskdocid: row.FK_TASKDOCID,
      image: row.IMAGE,

      tasktypeid: row.FK_TASKTYPEID,
      tasktypename: row.TASKTYPENAME,

      assignto: row.ASSIGNTO,
      teammembers: row.TEAMMEMBERS,

      employee_names: row.EMPLOYEE_NAMES,

      priorityid: row.FK_PRIORITYID,
      priorityname: row.PRIORITYNAME,

      taskstatusid: row.FK_TASKSTATUSID,
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
      lastupdate: row.LASTUPDATE,
    }));

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows,
    });

      });
  } catch (error) {
    console.error("❌ GET TASK REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task report",
      error: error.message,
    });
  }
};
