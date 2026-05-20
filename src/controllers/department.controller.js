'use strict';

const { addEditDepartment, getDepartment } = require('../services/department.service');

async function addEditDepart(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addEditDepartment(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      return res.status(400).json({
        message: result?.message || 'Failed to save department'
      });
    }

    if (result === null || result === undefined) {
      return res.status(404).json({ message: 'No Data Found' });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Department saved successfully'
    });

  } catch (error) {
    console.log('addEditDepart Error =>', error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function getAllDepartment(req, res) {
  try {
    const result = await getDepartment();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Department fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.log('getAllDepartment Error =>', error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = {
  addEditDepart,
  getAllDepartment
};