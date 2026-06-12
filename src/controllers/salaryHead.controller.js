'use strict';

const logger = require('../config/logger');
const { addEditSalaryHead, getSalaryHead } = require('../services/salaryHead.service');

async function AddEditSalaryHead(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditSalaryHead(req.body, actorId);
    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }
    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save Salary Head');
    }
    return res.success( result, result?.message || 'Salary Head saved successfully');
  } catch (error) {
    logger.error('AddEditSalaryHead Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

async function getAllSalaryHead(req, res) {
  try {
    const result = await getSalaryHead();
    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }
    return res.success(
      result || [],
      result?.length ? 'Salary Head fetched successfully' : 'No Data Found'
    );
  } catch (error) {
    logger.error('getAllSalaryHead Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditSalaryHead,
  getAllSalaryHead
};