'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditHoliday , getHoliday} = require('../services/holiday.service');

async function AddEditHoliday(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addEditHoliday(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}

async function getAllHoliday(req, res) {
    const result = await getHoliday();
    if (!result || result.length === 0) {
        return res.success({
            data: [],
            message: 'No Data Found'
        }, httpStatus.OK);
    }
    return res.success({
        data: result,
        message: 'Holiday fetched successfully'
    }, httpStatus.OK);
}
module.exports = {
  AddEditHoliday,
  getAllHoliday
};