'use strict';

const httpStatus = require('../constants/httpStatus');
const {
  addEditUserProfile,
  getUsersProfile
} = require('../services/userprofile.service');
const logger = require('../config/logger');

async function addUserProfile(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';

    const result = await addEditUserProfile(req.body, actorId);

    if (!result) {
      return res.fail(httpStatus.NOT_FOUND, 'No Data Found');
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(httpStatus.SERVICE_UNAVAILABLE, 'Network Error! Database not connected');
    }

    if (result?.status === false) {
      return res.fail(httpStatus.BAD_REQUEST, result?.message || 'Failed to save user profile');
    }

    return res.success(result, result?.message || 'User profile saved successfully');

  } catch (error) {
   logger.error('addUserProfile Error =>', error);

    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

async function getAllUsers(req, res) {
  try {
    const result = await getUsersProfile();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(httpStatus.SERVICE_UNAVAILABLE, 'Network Error! Database not connected');
    }

    if (!result || result.length === 0) {
      return res.success([], 'No Data Found');
    }

    return res.success(result, 'Users fetched successfully');

  } catch (error) {
   logger.error('getAllUsers Error =>', error);

    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

module.exports = {
  addUserProfile,
  getAllUsers
};
