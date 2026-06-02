'use strict';

const { addEditEmp, getEmployees, deleteEmployee } = require('../services/employee.service');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

function buildImageUrl(filename) {
  if (!filename) return null;
  const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${base}/uploads/${filename}`;
}

function removeFile(filename) {
  if (!filename) return;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err)logger.error(`File delete error: ${err.message}`);
  });
}

async function AddEditEmployee(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';

    if (req.file) {
      req.body.imageUrl = buildImageUrl(req.file.filename);
    }

    const result = await addEditEmp(req.body, actorId);
    if (!result) {
      if (req.file) removeFile(req.file.filename);
      return res.fail(404, 'No Data Found');
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      if (req.file) removeFile(req.file.filename);
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      if (req.file) removeFile(req.file.filename);
      return res.fail(400, result?.message || 'Failed to save employee');
    }

    return res.success(result, result?.message || 'Employee saved successfully');

  } catch (error) {
    if (req.file) removeFile(req.file.filename);
    return res.fail(
    500,
    error.message || "Internal Server Error"
  );
  }
}

async function getAllEmployee(req, res) {
  try {
    const voffset = Number(req.query.offset) || 0;
    const vlimit = Number(req.query.limit) || 10;

    const result = await getEmployees(voffset, vlimit);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (!result || result.length === 0) {
      return res.success([], 'No Data Found');
    }

    return res.success(result, 'Employees fetched successfully');

  } catch (error) {
   logger.error('getAllEmployee Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

async function DeleteEmployee(req, res) {
  try {

    const { id } = req.params;

    const result = await deleteEmployee(
      id,
      req.user?.username || "System"
    );

    return res.success({}, result.message);

  } catch (error) {

   logger.error("DeleteEmployee Error =>", error);

    return res.fail(500, "Internal Server Error");
  }
}

module.exports = {
  AddEditEmployee,
  getAllEmployee,
  DeleteEmployee
};
