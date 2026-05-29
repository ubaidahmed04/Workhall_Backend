'use strict';

const { addClient, getClients } = require('../services/client.service');
const logger = require('../config/logger');

async function AddEditClient(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addClient(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save client');
    }

    if (result === null || result === undefined) {
      return res.fail(404, 'No Data Found');
    }

    return res.success(result, result?.message || 'Client saved successfully');

  } catch (error) {
    logger.error('AddEditClient Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

async function getAllClients(req, res) {
  try {
    const result = await getClients();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Clients fetched successfully' : 'No Data Found');

  } catch (error) {
    logger.error('getAllClients Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditClient,
  getAllClients
};
