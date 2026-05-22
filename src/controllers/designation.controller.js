'use strict';

const { addEditDesig, getDesignation } = require('../services/designation.service');

async function addEditDesignation(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditDesig(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      return res.status(400).json({
        message: result?.message || 'Failed to save designation'
      });
    }

    if (result === null || result === undefined) {
      return res.status(404).json({ message: 'No Data Found' });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Designation saved successfully'
    });

  } catch (error) {
    console.log('addEditDesignation Error =>', error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function getAllDesignation(req, res) {
  try {
    const result = await getDesignation();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Designation fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.log('getAllDesignation Error =>', error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = {
  addEditDesignation,
  getAllDesignation
};