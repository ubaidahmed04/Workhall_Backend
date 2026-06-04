const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');
const fs = require("fs");
const path = require("path");


async function addEditEmp(body, actorId) {
  const {
    vempid,
    vfirstname,
    vlastname,
    vemail,
    vphone,
    vemergencycontact,
    vemgphone,
    vjoiningdate,
    vexitdate,
    vfk_qualificationid,
    vfk_departmentid,
    vfk_designationid,
    vmajor,
    vstatus,
    vimagestatus,
    vfk_hrdocid,
    imageUrl,   //
  } = body;


  const emergencyContact = vemergencycontact ?? vemgphone ?? null;

  return withConnection(async (conn) => {

    // ── Execute procedure ───────────────────────────────────────────────────
    const result = await conn.execute(
      `BEGIN add_edit_employee(
        :vempid,
        :vfirstname,
        :vlastname,
        :vemail,
        :vphone,
        :vemgphone,
        :vjoiningdate,
        :vexitdate,
        :vhrdoc,
        :vfk_hrdocid,
        :vfk_qualifid,
        :vfk_departid,
        :vfk_designid,
        :vmajor,
        :vstatus,
        :vimagestatus,
        :vcreatedby,
        :vmessage
      ); END;`,
      {
        vempid: vempid ? Number(vempid) : null,
        vfirstname: vfirstname || null,
        vlastname: vlastname || null,
        vemail: vemail || null,
        vphone: vphone || null,
        vemgphone: emergencyContact,
        vjoiningdate: vjoiningdate ? new Date(vjoiningdate) : null,
        vexitdate: vexitdate ? new Date(vexitdate) : null,

        //  Now a plain string (image URL) 
        vhrdoc: imageUrl || null,

        vfk_hrdocid: vfk_hrdocid ? Number(vfk_hrdocid) : null,
        vfk_qualifid: vfk_qualificationid ? Number(vfk_qualificationid) : null,
        vfk_departid: vfk_departmentid ? Number(vfk_departmentid) : null,
        vfk_designid: vfk_designationid ? Number(vfk_designationid) : null,

        // vskills: { val: [], type: oracledb.DB_TYPE_OBJECT },

        vmajor: vmajor || null,
        vstatus: vstatus !== undefined ? Number(vstatus) : 0,
        vimagestatus: vimagestatus !== undefined ? Number(vimagestatus) : 0,
        vcreatedby: actorId,

        vmessage: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 200,
        },
      },
      { autoCommit: true }
    );
    logger.debug(result);

    return { message: result?.outBinds?.vmessage };
  });
}

async function getEmployees(voffset = 0, vlimit = 10, vtype) {
  logger.info({ voffset, vlimit }, "Fetching employee list");

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
        get_employees(:voffset, :vlimit, :vtype, :retval);
       END;`,
      {
        voffset,
        vlimit,
        vtype,
        retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const resultSet = result.outBinds.retval;
    const rows = await resultSet.getRows(500);
    await resultSet.close();

    logger.debug(`Fetched ${rows.length} employees`);

    return rows.map((row) => ({
      empid: row.EMPID,
      firstname: row.FIRSTNAME,
      lastname: row.LASTNAME,
      email: row.EMAIL,
      phone: row.PHONE,
      emergencycontact: row.EMERGENCYCONTACT,

      fk_qualificationid: row.FK_QUALIFICATIONID,
      fk_departmentid: row.FK_DEPARTMENTID,
      fk_designationid: row.FK_DESIGNATIONID,

      qualificaname: row.QUALIFICANAME,
      depname: row.DEPNAME,
      designame: row.DESIGNAME,

      joindate: row.JOINDATE,
      exitdate: row.EXITDATE,
      major: row.MAJOR,
      status: row.STATUS,
      image: row.IMAGE || null,
      hrdocid: row.HRDOCID || null,

    }));
  });
}


async function deleteEmployee(empid, username) {
  return withConnection(async (conn) => {

    const result = await conn.execute(
      `BEGIN
          delete_employee(
            :vempid,
            :vcreatedby,
            :vmessage
          );
       END;`,
      {
        vempid: {
          val: Number(empid),
          type: oracledb.NUMBER,
        },

        vcreatedby: {
          val: username,
          type: oracledb.STRING,
        },

        vmessage: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 500,
        },
      },
      {
        autoCommit: true,
      }
    );

    return {
      status: true,
      message: result.outBinds.vmessage,
    };
  });
}







module.exports = { getEmployees, addEditEmp, deleteEmployee };