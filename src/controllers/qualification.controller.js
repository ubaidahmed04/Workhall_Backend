'use strict';

const { addEditQalify, getQualification } = require('../services/qualification.service');

async function AddEditQualification(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addEditQalify(req.body, actorId);

    if (!result) return res.status(404).json({ message: 'No Data Found' });

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      return res.status(400).json({
        message: result?.message || 'Failed to save qualification'
      });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Qualification saved successfully'
    });

  } catch (error) {
    console.log('AddEditQualification Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getAllQualification(req, res) {
  try {
    const result = await getQualification();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Qualification fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.log('getAllQualification Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  AddEditQualification,
  getAllQualification
};