'use strict';

const logger = require('../config/logger');
const { buildImageUrl } = require('../helpers/buildImageUrl');
const { getTaskStatus, getPriority, addTask, getAllTask } = require('../services/task.service');



async function AddEditTask(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    if (req.file) req.body.vtaskdoc = buildImageUrl(req.file.filename);

    logger.info("TASK INSERT PAYLOAD =>", req.body);
    logger.info("TASK DOC =>", req.file);

    const result = await addTask(req.body, actorId);
    if (!result) return res.fail(400, 'Unable to save task');

    return res.success(result, result.message || 'Task saved successfully');
  } catch (error) {
    logger.error('AddEditTask Error =>', error);
    return res.fail(500, error.message || 'Internal Server Error', error);
  }
}

async function GetAllTask(req, res) {
  console.log("query parameter",req.query);
  try {
    const result = await getAllTask({
      vfromdate: req.query.vfromdate,
      vtodate: req.query.vtodate,
      vempid: req.query.vempid,
      vtaskstatus: req.query.vtaskstatus
    });

    return res.success(result, result.length ? "Tasks fetched successfully" : "No Data Found");
  } catch (error) {
    logger.error("GetAllTask Error =>", error);
    return res.fail(500, "Internal Server Error");
  }
}

async function getAllTaskStatus(req, res) {
  try {
    const result = await getTaskStatus();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'TaskStatus fetched successfully' : 'No Data Found');

  } catch (error) {
    logger.error('getAllTaskStatus Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

async function getAllPriority(req, res) {
  try {
    const result = await getPriority();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Priority fetched successfully' : 'No Data Found');

  } catch (error) {
    logger.error('getAllPriority Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditTask,
  getAllTaskStatus,
  getAllPriority,
  GetAllTask,

};
