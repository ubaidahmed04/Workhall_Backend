

const logger = require('../config/logger');

const  { addEditRoom, getAllRoom } =  require("../services/room.service.js");

async function AddEditRoom(req, res) {
  try {
    const actorId = req.user?.username || "SYSTEM";

    const result = await addEditRoom(req.body, actorId);

    return res.success(
      result,
      result.message || "Room saved successfully"
    );
  } catch (error) {
    logger.error("AddEditRoom Error =>", error);

    return res.fail(
      500,
      error.message || "Internal Server Error"
    );
  }
}

async function GetAllRoom(req, res) {
  try {
    const result = await getAllRoom();

    if (result?.code === "DB_CONNECTION_ERROR") {
      return res.fail(
        503,
        "Database not connected"
      );
    }

    return res.success(
      result || [],
      result?.length
        ? "Rooms fetched successfully"
        : "No Data Found"
    );
  } catch (error) {
    logger.error("GetAllRoom Error =>", error);

    return res.fail(
      500,
      "Internal Server Error"
    );
  }
}

module.exports =  {
  AddEditRoom,
  GetAllRoom,
};