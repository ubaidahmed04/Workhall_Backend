'use strict';

const { addEditEmpLeave, getEmpLeaves } = require('../services/empLeave.service');

async function AddEditEmpLeave(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditEmpLeave(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      return res.status(400).json({
        message: result?.message || 'Failed to save employee leave'
      });
    }

    if (result === null || result === undefined) {
      return res.status(404).json({ message: 'No Data Found' });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Employee leave saved successfully'
    });

  } catch (error) {
    console.log('AddEditEmpLeave Error =>', error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function GetEmpLeaves(req, res) {
  try {
    const result = await getEmpLeaves();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Employee leaves fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.log('GetEmpLeaves Error =>', error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = {
  AddEditEmpLeave,
  GetEmpLeaves
};