"use strict";

const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");
const logger = require("../config/logger");

async function addEditRent(payload, actorId) {
  const {
    vrentid,
    vfk_roomid,
    vfk_branchid,
    vfk_clientid,
    vtable,
    vchair,
    varea,
    vrentstatus,
    vstatus,
  } = payload;

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          add_edit_rent(
            :vrentid,
            :vfk_roomid,
            :vfk_branchid,
            :vfk_clientid,
            :vtable,
            :vchair,
            :varea,
            :vrentstatus,
            :vstatus,
            :vcreatedby,
            :vmessage
          );
       END;`,
      {
        vrentid: vrentid
          ? Number(vrentid)
          : null,

        vfk_roomid: vfk_roomid
          ? Number(vfk_roomid)
          : null,

        vfk_branchid: vfk_branchid
          ? Number(vfk_branchid)
          : null,

        vfk_clientid: vfk_clientid
          ? Number(vfk_clientid)
          : null,

        vtable:
          vtable !== undefined
            ? Number(vtable)
            : null,

        vchair:
          vchair !== undefined
            ? Number(vchair)
            : null,

        varea:
          varea !== undefined
            ? Number(varea)
            : null,

        vrentstatus:
          vrentstatus !== undefined
            ? Number(vrentstatus)
            : null,

        vstatus:
          vstatus !== undefined
            ? Number(vstatus)
            : 0,

        vcreatedby: actorId,

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
      message:
        result?.outBinds?.vmessage,
    };
  });
}
async function getRentDetail() {
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          get_rentdetail(:retval);
       END;`,
      {
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      }
    );

    const rs = result.outBinds.retval;

    const rows = await rs.getRows(10000);

    await rs.close();

    return rows.map((row) => ({
      branchname: row.BRANCHNAME,
      roomid: row.ROOMID,
      rentid: row.RENTID,
      roomname: row.ROOMNAME,

      clientid: row.CLIENTID,
      clientname: row.CLIENTNAME,

      rented_sqft: row.RENTED_SQFT,
      available_sqft: row.AVAILABLE_SQFT,

      fk_branchid: row.FK_BRANCHID,
      tables: row.TABLES,
      chairs: row.CHAIRS,

      rentstatus: row.RENTSTATUS,
      status: row.STATUS,

      roomstatus: row.ROOMSTATUS,
    }));
  });
}

async function getRentDetailAvail( vfk_branchid, vfk_roomid) {
    console.log(vfk_branchid, vfk_roomid)
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          get_rentdetail_avail(
            :vfk_branchid,
            :vfk_roomid,
            :retval
          );
       END;`,
      {
        vfk_branchid: vfk_branchid
          ? Number(vfk_branchid)
          : null,

        vfk_roomid: vfk_roomid
          ? Number(vfk_roomid)
          : null,

        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      }
    );

    const rs = result.outBinds.retval;
    console.log(result)
    const rows = await rs.getRows(10000);

    await rs.close();

    return rows.map((row) => ({
      fk_branchid: row.FK_BRANCHID,
      branchname: row.BRANCHNAME,
      fk_roomid: row.FK_ROOMID,
      roomname: row.ROOMNAME,
      total: row.TOTAL,
      avail: row.AVAIL,
    }));
  });
}

module.exports = {
  addEditRent,
  getRentDetailAvail,
  getRentDetail
};