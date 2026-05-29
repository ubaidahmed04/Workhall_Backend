'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditSkills, getSkills } = require('../services/skills.service');
const logger = require('../config/logger');

async function AddEditSkill(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditSkills(req.body, actorId);

    if (!result) {
      return res.fail(httpStatus.NOT_FOUND, 'No Data Found');
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(httpStatus.SERVICE_UNAVAILABLE, 'Network Error! Database not connected');
    }

    if (result?.status === false) {
      return res.fail(httpStatus.BAD_REQUEST, result?.message || 'Failed to save skill');
    }

    return res.success(result, result?.message || 'Skill saved successfully');

  } catch (error) {
   logger.error('AddEditSkill Error =>', error);
    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

async function getAllSkills(req, res) {
  try {
    const result = await getSkills();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(httpStatus.SERVICE_UNAVAILABLE, 'Network Error! Database not connected');
    }

    if (!result || result.length === 0) {
      return res.success([], 'No Data Found');
    }

    return res.success(result, 'Skills fetched successfully');

  } catch (error) {
   logger.error('getAllSkills Error =>', error);
    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

module.exports = {
  AddEditSkill,
  getAllSkills
};
