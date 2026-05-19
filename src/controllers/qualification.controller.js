'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditQalify, getQualification } = require('../services/qualification.service');

async function AddEditQualification(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addEditQalify(req.body, actorId);

    if (!result) {
      return res.error({ message: 'No Data Found' }, httpStatus.NOT_FOUND);
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({
        message: 'Network Error! Database not connected'
      }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (result?.status === false) {
      return res.error({
        message: result?.message || 'Failed to save qualification'
      }, httpStatus.BAD_REQUEST);
    }

    return res.success({
      data: result,
      message: result?.message || 'Qualification saved successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('AddEditQualification Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getAllQualification(req, res) {
  try {
    const result = await getQualification();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({
        message: 'Network Error! Database not connected'
      }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (!result || result.length === 0) {
      return res.success({
        data: [],
        message: 'No Data Found'
      }, httpStatus.OK);
    }

    return res.success({
      data: result,
      message: 'Qualification fetched successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('getAllQualification Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  AddEditQualification,
  getAllQualification
};