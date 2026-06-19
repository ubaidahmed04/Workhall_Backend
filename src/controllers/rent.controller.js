const logger = require("../config/logger");
const { getRentDetail } = require("../services/rent.service");

const {
  addEditRent,
  getRentDetailAvail,
} = require("../services/rent.service");

async function AddEditRent(req, res) {
  try {
    const actorId = req.user?.username || "SYSTEM";

    const result = await addEditRent(req.body, actorId);

    return res.success(
      result,
      result.message || "Rent saved successfully"
    );
  } catch (error) {
    logger.error("AddEditRent Error =>", error);

    return res.fail(
      500,
      error.message || "Internal Server Error"
    );
  }
}

async function GetRentDetailAvail(req, res) {
  try {
    const { vfk_branchid, vfk_roomid } = req.query;

    const result = await getRentDetailAvail(
      vfk_branchid,
      vfk_roomid
    );

    if (result?.code === "DB_CONNECTION_ERROR") {
      return res.fail(
        503,
        "Database not connected"
      );
    }

    return res.success(
      result || [],
      result?.length
        ? "Rent details fetched successfully"
        : "No Data Found"
    );
  } catch (error) {
    logger.error(
      "GetRentDetailAvail Error =>",
      error
    );

    return res.fail(
      500,
      "Internal Server Error"
    );
  }
}

async function GetRentDetail(req, res) {
  try {
    const result = await getRentDetail();

    if (result?.code === "DB_CONNECTION_ERROR") {
      return res.fail(
        503,
        "Database not connected"
      );
    }

    return res.success(
      result || [],
      result?.length
        ? "Rent details fetched successfully"
        : "No Data Found"
    );
  } catch (error) {
    logger.error(
      "GetRentDetail Error =>",
      error
    );

    return res.fail(
      500,
      "Internal Server Error"
    );
  }
}
module.exports = {
  AddEditRent,
  GetRentDetailAvail,
  GetRentDetail
};