'use strict';

const logger = require('../config/logger');
const httpStatus = require('../constants/httpStatus');
const { saveAttendance, fetchAllAttendance, softDeleteAttendance, fetchAttendanceByDate, getDeptAttSummary } = require('../services/attendence.service');

async function AddEditAttendance(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const username = req.user?.username || 'SYSTEM';

    const result = await saveAttendance(req.body, actorId, username);
    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.fail(httpStatus.SERVICE_UNAVAILABLE, 'Network Error! Database not connected');

    if (result === null || result === undefined)
      return res.fail(httpStatus.NOT_FOUND, 'No Data Found');

    if (result?.status === false)
      return res.fail(httpStatus.BAD_REQUEST, result?.outBinds?.message || 'Failed to save attendance');

    return res.success(result, result?.outBinds?.message || 'Attendance saved successfully');

  } catch (error) {
    console.error('AddEditAttendance Error =>', error);
    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

async function getAllAttendance(req, res) {
  try {
    const result = await fetchAllAttendance();

    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.fail(httpStatus.SERVICE_UNAVAILABLE, 'Network Error! Database not connected');

    return res.success(result || [], result?.length ? 'Attendance fetched successfully' : 'No Data Found');

  } catch (error) {
    console.error('getAllAttendance Error =>', error);
    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

async function getAttendanceByDate(req, res) {
  try {
    const { fromdate, todate } = req.query;

    if (!fromdate || !todate) {
      return res.fail(httpStatus.BAD_REQUEST, 'From Date and To Date are required');
    }

    const result = await fetchAttendanceByDate( fromdate, todate );

    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.fail(httpStatus.SERVICE_UNAVAILABLE, 'Network Error! Database not connected');

    return res.success(result || [], result ? 'Attendance found' : 'No attendance found for this date');

  } catch (error) {
    console.error('getAttendanceByDate Error =>', error);
    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

const getDeptAttendanceSummary = async (req, res) => {
  try {

    const data = await getDeptAttSummary();

    return res.success(data, "Department attendance summary fetched successfully");

  } catch (err) {

    logger.error(err);

    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, err.message || "Internal server error");

  }
};

async function deleteAttendance(req, res) {
  try {
    const { id } = req.params;
    const actorId = req.user?.username || 'SYSTEM';
    if (!id) return res.fail(httpStatus.BAD_REQUEST, 'Attendance ID required');

    const result = await softDeleteAttendance(id, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.fail(httpStatus.SERVICE_UNAVAILABLE, 'Network Error! Database not connected');

    if (result?.status === false)
      return res.fail(httpStatus.BAD_REQUEST, result?.message || 'Failed to delete attendance');

    return res.success({}, result?.message || 'Attendance deleted successfully');

  } catch (error) {
    console.error('deleteAttendance Error =>', error);
    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

module.exports = { AddEditAttendance, getAllAttendance, getAttendanceByDate, deleteAttendance, getDeptAttendanceSummary };
