'use strict';

const oracledb = require('oracledb');
const { withConnection } = require('../database/oraclePool');
const logger = require('../config/logger');

async function addEditClient(payload, actorId) {
  const {
    vclientid, vclientname, vaddress, vcontact, vemail,
    vstartdate, venddate, vfk_condocid, vcondoc, vimagestatus, vstatus
  } = payload;
  
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          add_edit_client(
            :vclientid, :vclientname, :vaddress, :vcontact, :vemail,
            :vstartdate, :venddate, :vfk_condocid, :vcondoc, :vimagestatus,
            :vstatus, :vcreatedby, :vmessage
          );
      END;`,
      {
        vclientid: vclientid ? Number(vclientid) : null,
        vclientname: vclientname || null,
        vaddress: vaddress || null,
        vcontact: vcontact || null,
        vemail: vemail || null,
        vstartdate: vstartdate ? new Date(vstartdate) : null,
        venddate: venddate ? new Date(venddate) : null,
        vfk_condocid: vfk_condocid ? Number(vfk_condocid) : null,
        vcondoc: vcondoc || null,
        vimagestatus: vimagestatus !== undefined ? Number(vimagestatus) : 0,
        vstatus: vstatus !== undefined ? Number(vstatus) : 0,
        vcreatedby: actorId,
        vmessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      },
      { autoCommit: true }
    );

    return { status: true, message: result?.outBinds?.vmessage };
  });
}

async function getClient(filters = {}) {
  const { vstartdate, venddate, vclientid } = filters;

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN get_client(:vstartdate, :venddate, :vclientid, :retval); END;`,
      {
        vstartdate: vstartdate ? new Date(vstartdate) : null,
        venddate: venddate ? new Date(venddate) : null,
        vclientid: vclientid ? Number(vclientid) : null,
        retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    const rs = result.outBinds.retval;
    const rows = await rs.getRows();
    await rs.close();

    return rows.map((row) => ({
      clientid: row.CLIENTID,
      clientname: row.CLIENTNAME,
      address: row.ADDRESS,
      phone: row.PHONE,
      email: row.EMAIL,
      startdate: row.STARTDATE,
      enddate: row.ENDDATE,
      fk_condocid: row.FK_CONDOCID,
      image: row.IMAGE,
      status: row.STATUS,
      createdby: row.CREATEDBY,
      editby: row.EDITBY
    }));
  });
}

module.exports = {
  addEditClient,
  getClient
};