'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditUserProfile, getUsersProfile } = require('../services/userprofile.service');

async function addUserProfile(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addEditUserProfile(req.body, actorId);

    if (!result) {
      return res.error({ message: 'No Data Found' }, httpStatus.NOT_FOUND);
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (result?.status === false) {
      return res.error({ message: result?.message || 'Failed to save user profile' }, httpStatus.BAD_REQUEST);
    }

    return res.success({
      data: result,
      message: result?.message || 'User profile saved successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('addUserProfile Error =>', error);
    return res.error({ message: 'Internal Server Error' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getAllUsers(req, res) {
  try {
    const result = await getUsersProfile();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (!result || result.length === 0) {
      return res.success({ data: [], message: 'No Data Found' }, httpStatus.OK);
    }

    return res.success({
      data: result,
      message: 'Users fetched successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('getAllUsers Error =>', error);
    return res.error({ message: 'Internal Server Error' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  addUserProfile,
  getAllUsers
};