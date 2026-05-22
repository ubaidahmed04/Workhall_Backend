'use strict';

const { addEditLeave, getLeaves } = require('../services/leave.service');

async function AddEditLeave(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditLeave(req.body, actorId);

    if (!result) return res.status(404).json({ message: 'No Data Found' });

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      return res.status(400).json({
        message: result?.message || 'Failed to save leave'
      });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Leave saved successfully'
    });

  } catch (error) {
    console.log('AddEditLeave Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function GetLeaves(req, res) {
  try {
    const result = await getLeaves();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Leaves fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.log('GetLeaves Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  AddEditLeave,
  GetLeaves
};