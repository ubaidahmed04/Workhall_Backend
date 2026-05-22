'use strict';

const httpStatus = require('../constants/httpStatus');
const {
  addEditUserProfile,
  getUsersProfile
} = require('../services/userprofile.service');

async function addUserProfile(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';

    const result = await addEditUserProfile(req.body, actorId);

    if (!result) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'No Data Found'
      });
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(httpStatus.SERVICE_UNAVAILABLE).json({
        success: false,
        message: 'Network Error! Database not connected'
      });
    }

    if (result?.status === false) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: result?.message || 'Failed to save user profile'
      });
    }

    return res.status(httpStatus.OK).json({
      success: true,
      data: result,
      message: result?.message || 'User profile saved successfully'
    });

  } catch (error) {
    console.log('addUserProfile Error =>', error);

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const result = await getUsersProfile();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(httpStatus.SERVICE_UNAVAILABLE).json({
        success: false,
        message: 'Network Error! Database not connected'
      });
    }

    if (!result || result.length === 0) {
      return res.status(httpStatus.OK).json({
        success: true,
        data: [],
        message: 'No Data Found'
      });
    }

    return res.status(httpStatus.OK).json({
      success: true,
      data: result,
      message: 'Users fetched successfully'
    });

  } catch (error) {
    console.log('getAllUsers Error =>', error);

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
}

module.exports = {
  addUserProfile,
  getAllUsers
};