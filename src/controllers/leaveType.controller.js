'use strict';

const { addEditLeaveType, getLeaveTypes } = require('../services/leavetype.service');

async function AddEditLeaveType(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditLeaveType(req.body, actorId);

    if (!result) return res.status(404).json({ message: 'No Data Found' });

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      return res.status(400).json({
        message: result?.message || 'Failed to save leave type'
      });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Leave type saved successfully'
    });

  } catch (error) {
    console.log('AddEditLeaveType Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function GetLeaveTypes(req, res) {
  try {
    const result = await getLeaveTypes();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Leave types fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.log('GetLeaveTypes Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  AddEditLeaveType,
  GetLeaveTypes
};