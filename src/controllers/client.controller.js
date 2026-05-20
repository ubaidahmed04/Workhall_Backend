'use strict';

const { addClient, getClients } = require('../services/client.service');

async function AddEditClient(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addClient(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      return res.status(400).json({
        message: result?.message || 'Failed to save client'
      });
    }

    if (result === null || result === undefined) {
      return res.status(404).json({ message: 'No Data Found' });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Client saved successfully'
    });

  } catch (error) {
    console.log('AddEditClient Error =>', error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function getAllClients(req, res) {
  try {
    const result = await getClients();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({
        message: 'Database not connected'
      });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Clients fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.log('getAllClients Error =>', error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = {
  AddEditClient,
  getAllClients
};