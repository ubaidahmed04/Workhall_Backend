'use strict';

const httpStatus = require('../constants/httpStatus');
const {addEditUserProfile} = require('../services/');

async function addUserProfile(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addEditUserProfile(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}

module.exports = {
  addUserProfile
};