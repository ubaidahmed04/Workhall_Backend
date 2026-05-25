'use strict';

const httpStatus = require('../constants/httpStatus');
const { saveAttendance, fetchAllAttendance, softDeleteAttendance, fetchAttendanceByDate, getDeptAttSummary } = require('../services/attendence.service');

async function AddEditAttendance(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const username = req.user?.username || 'SYSTEM';

    const result = await saveAttendance(req.body, actorId, username);
    // console.log(result)
    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.status(503).json({ message: 'Network Error! Database not connected' });

    if (result === null || result === undefined)
      return res.status(404).json({ message: 'No Data Found' });

    if (result?.status === false)
      return res.status(400).json({ message: result?.outBinds?.message || 'Failed to save attendance' });

    return res.status(200).json({ data: result, message: result?.outBinds?.message || 'Attendance saved successfully' });

  } catch (error) {
    console.error('AddEditAttendance Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getAllAttendance(req, res) {
  try {
    const result = await fetchAllAttendance();

    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.status(503).json({ message: 'Network Error! Database not connected' });

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Attendance fetched successfully' : 'No Data Found',
    });

  } catch (error) {
    console.error('getAllAttendance Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getAttendanceByDate(req, res) {
  try {
    const { fromdate, todate } = req.query;

    if (!fromdate || !todate) {
      return res.status(400).json({
        message: 'From Date and To Date are required',
      });
    }

    const result = await fetchAttendanceByDate( fromdate, todate );

    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.status(503).json({ message: 'Network Error! Database not connected' });

    return res.status(200).json({
      data: result || [],
      message: result ? 'Attendance found' : 'No attendance found for this date',
    });

  } catch (error) {
    console.error('getAttendanceByDate Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const getDeptAttendanceSummary = async (req, res) => {
  try {

    const data = await getDeptAttSummary();

    return res.status(200).json({
      success: true,
      message: "Department attendance summary fetched successfully",
      data,
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });

  }
};

async function deleteAttendance(req, res) {
  try {
    const { id } = req.params;
    const actorId = req.user?.username || 'SYSTEM';
    if (!id) return res.status(400).json({ message: 'Attendance ID required' });

    const result = await softDeleteAttendance(id, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.status(503).json({ message: 'Network Error! Database not connected' });

    if (result?.status === false)
      return res.status(400).json({ message: result?.message || 'Failed to delete attendance' });

    return res.status(200).json({ message: result?.message || 'Attendance deleted successfully' });

  } catch (error) {
    console.error('deleteAttendance Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { AddEditAttendance, getAllAttendance, getAttendanceByDate, deleteAttendance, getDeptAttendanceSummary };