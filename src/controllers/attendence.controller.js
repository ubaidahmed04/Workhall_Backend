'use strict';

const httpStatus = require('../constants/httpStatus');
const { saveAttendance, fetchAllAttendance, softDeleteAttendance, fetchAttendanceByDate } = require('../services/attendence.service');
// const { saveAttendance, fetchAllAttendance, softDeleteAttendance, fetchAttendanceByDate } = require('../services/attendance.service');

async function AddEditAttendance(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const username = req.user?.username || 'SYSTEM';

    const result = await saveAttendance(req.body, actorId, username);

    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.status(503).json({ message: 'Network Error! Database not connected' });

    if (result === null || result === undefined)
      return res.status(404).json({ message: 'No Data Found' });

    if (result?.status === false)
      return res.status(400).json({ message: result?.message || 'Failed to save attendance' });

    return res.status(200).json({ data: result, message: result?.message || 'Attendance saved successfully' });

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
    const { date, empid } = req.query;

    if (!date) return res.status(400).json({ message: 'Date is required' });

    const result = await fetchAttendanceByDate(date, empid);

    if (result?.code === 'DB_CONNECTION_ERROR')
      return res.status(503).json({ message: 'Network Error! Database not connected' });

    return res.status(200).json({
      data: result || null,
      message: result ? 'Attendance found' : 'No attendance found for this date',
    });

  } catch (error) {
    console.error('getAttendanceByDate Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function deleteAttendance(req, res) {
  try {
    const { id } = req.params;
    const actorId = req.user?.userid || 'SYSTEM';
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

module.exports = { AddEditAttendance, getAllAttendance, getAttendanceByDate, deleteAttendance };