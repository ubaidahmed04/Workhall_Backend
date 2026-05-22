'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditSkills, getSkills } = require('../services/skills.service');

async function AddEditSkill(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditSkills(req.body, actorId);

    if (!result) {
      return res.error({ message: 'No Data Found' }, httpStatus.NOT_FOUND);
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (result?.status === false) {
      return res.error({ message: result?.message || 'Failed to save skill' }, httpStatus.BAD_REQUEST);
    }

    return res.success({
      data: result,
      message: result?.message || 'Skill saved successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('AddEditSkill Error =>', error);
    return res.error({ message: 'Internal Server Error' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getAllSkills(req, res) {
  try {
    const result = await getSkills();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (!result || result.length === 0) {
      return res.success({ data: [], message: 'No Data Found' }, httpStatus.OK);
    }

    return res.success({
      data: result,
      message: 'Skills fetched successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('getAllSkills Error =>', error);
    return res.error({ message: 'Internal Server Error' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  AddEditSkill,
  getAllSkills
};