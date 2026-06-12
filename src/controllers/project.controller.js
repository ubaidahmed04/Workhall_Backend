'use strict';

const logger = require('../config/logger');
const { addEditProject, getProject } = require('../services/project.service');

async function AddEditProject(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditProject(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save Project');
    }

    if (result === null || result === undefined) {
      return res.fail(404, 'No Data Found');
    }

    return res.success(result, result?.message || 'Project saved successfully');

  } catch (error) {
    logger.error('addEditProject Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

async function getAllProject(req, res) {
  try {
    const result = await getProject();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Project fetched successfully' : 'No Data Found');

  } catch (error) {
   logger.error('getAllProject Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditProject,
  getAllProject
};
