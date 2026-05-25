const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');
const fs = require("fs");
const path = require("path");


function parseSkills(raw) {
  if (!raw) return null;

  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") {
    return raw; // already fine
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  if (Array.isArray(raw)) {
    try {
      return raw.map((item) => (typeof item === "string" ? JSON.parse(item) : item));
    } catch {
      return null;
    }
  }

  return null;
}

function normaliseSkill(skill) {
  if (typeof skill === "string" || typeof skill === "number") {
    return { skillid: Number(skill), skillstatus: 1, certificates: [] };
  }
  return {
    skillid: Number(skill.skillid ?? skill.vfk_skillid),
    skillstatus: skill.skillstatus !== undefined ? Number(skill.skillstatus) : 1,
    certificates: Array.isArray(skill.certificates) ? skill.certificates.map(Number) : [],
  };
}

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

  const skillsParsed = parseSkills(body.vskills);
  const skillObjects = skillsParsed ? skillsParsed.map(normaliseSkill) : null;

  const emergencyContact = vemergencycontact ?? vemgphone ?? null;

  return withConnection(async (conn) => {

    let skillTableVal = null;
    let SkillTableType = null;

    if (skillObjects && skillObjects.length > 0) {
      const SkillObj = await conn.getDbObjectClass("SKILL_OBJ");
      const CertTable = await conn.getDbObjectClass("CERT_TABLE");
      SkillTableType = await conn.getDbObjectClass("SKILL_TABLE");

      skillTableVal = new SkillTableType(
        skillObjects.map((s) => {
          const certTable = new CertTable(s.certificates);
          return new SkillObj({
            SKILLID: s.skillid,
            SKILLSTATUS: s.skillstatus,
            CERTIFICATES: certTable,
          });
        })
      );
    }

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
        :vskills,
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

        vskills: skillTableVal
          ? { val: skillTableVal, type: SkillTableType }
          : { val: null, type: oracledb.DB_TYPE_OBJECT },

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

async function getEmployees(voffset = 0, vlimit = 10) {
  logger.info({ voffset, vlimit }, "Fetching employee list");

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
        get_emp(:voffset, :vlimit, :retval);
       END;`,
      {
        voffset,
        vlimit,
        retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const resultSet = result.outBinds.retval;
    const rows = await resultSet.getRows();
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

      skills: row?.FK_SKILLIDS
        ? row.FK_SKILLIDS.split(",").map((id) => Number(id.trim()))
        : [],
      skillnames: row.SKILLNAMES || ""
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