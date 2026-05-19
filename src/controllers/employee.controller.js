'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditEmp, getEmployees } = require('../services/employee.service');
const path = require('path');
const fs = require('fs');

function buildImageUrl(filename) {
  if (!filename) return null;
  const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${base}/uploads/${filename}`;
}

function removeFile(filename) {
  if (!filename) return;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) console.log(`File delete error: ${err.message}`);
  });
}

async function AddEditEmployee(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';

    if (req.file) {
      req.body.imageUrl = buildImageUrl(req.file.filename);
    }

    const result = await addEditEmp(req.body, actorId);

    if (!result) {
      if (req.file) removeFile(req.file.filename);
      return res.error({ message: 'No Data Found' }, httpStatus.NOT_FOUND);
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      if (req.file) removeFile(req.file.filename);
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (result?.status === false || result?.message?.toLowerCase().includes('error')) {
      if (req.file) removeFile(req.file.filename);

      return res.error({
        message: result?.message || 'Failed to save employee'
      }, httpStatus.BAD_REQUEST);
    }

    return res.success({
      data: result,
      message: result?.message || 'Employee saved successfully'
    }, httpStatus.OK);

  } catch (error) {
    if (req.file) removeFile(req.file.filename);

    console.log('AddEditEmployee Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getAllEmployee(req, res) {
  try {
    const voffset = Number(req.query.offset) || 0;
    const vlimit = Number(req.query.limit) || 10;

    const result = await getEmployees(voffset, vlimit);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (!result || result.length === 0) {
      return res.success({
        data: [],
        message: 'No Data Found'
      }, httpStatus.OK);
    }

    return res.success({
      data: result,
      message: 'Employees fetched successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('getAllEmployee Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  AddEditEmployee,
  getAllEmployee
};