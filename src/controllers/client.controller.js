'use strict';

const logger = require('../config/logger');
const { buildImageUrl } = require('../helpers/buildImageUrl');

const { addEditClient, getClient } = require('../services/client.service');



async function AddEditClient(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';

    if (req.file) req.body.vcondoc = buildImageUrl(req.file.filename);

    const result = await addEditClient(req.body, actorId);
    return res.success(result, result.message || 'Client saved successfully');
  } catch (error) {
    logger.error('AddEditClient Error =>', error);
    return res.fail(500, error.message || 'Internal Server Error');
  }
}

async function GetAllClient(req, res) {
  try {
    const result = await getClient(req.query);
    return res.success(result || [], result?.length ? 'Client fetched successfully' : 'No Data Found');
  } catch (error) {
    logger.error('GetAllClient Error =>', error);
    return res.fail(500, 'Internal Server Error', error);
  }
}

module.exports = {
  AddEditClient,
  GetAllClient
};