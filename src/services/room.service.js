'use strict';

const oracledb = require('oracledb');
const { withConnection } = require('../database/oraclePool');
const logger = require('../config/logger');

async function addEditRoom(payload, actorId) {
  const {
    vroomid,
    vroomname,
    vfloors,
    vsqft,
    vfk_branchid,
    vstatus,
  } = payload;

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          add_edit_room(
            :vroomid,
            :vroomname,
            :vfloors,
            :vsqft,
            :vfk_branchid,
            :vstatus,
            :vcreatedby,
            :vmessage
          );
      END;`,
      {
        vroomid: vroomid
          ? Number(vroomid)
          : null,

        vroomname: vroomname || null,

        vfloors:
          vfloors !== undefined
            ? Number(vfloors)
            : null,

        vsqft:
          vsqft !== undefined
            ? Number(vsqft)
            : null,

        vfk_branchid:
          vfk_branchid
            ? Number(vfk_branchid)
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
async function getAllRoom() {
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          get_room(:retval);
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
      roomid: row.ROOMID,
      roomname: row.ROOMNAME,
      floors: row.FLOORS,
      sqft: row.SQFT,
      fk_branchid: row.FK_BRANCHID,
      branchname: row.BRANCHNAME,
      status: row.STATUS,
    }));
  });
}

module.exports = {
  addEditRoom,
  getAllRoom,
};
