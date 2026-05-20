'use strict';

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
      return res.status(404).json({ message: 'No Data Found' });
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      if (req.file) removeFile(req.file.filename);
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      if (req.file) removeFile(req.file.filename);
      return res.status(400).json({
        message: result?.message || 'Failed to save employee'
      });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Employee saved successfully'
    });

  } catch (error) {
    if (req.file) removeFile(req.file.filename);
    console.log('AddEditEmployee Error =>', error);

    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getAllEmployee(req, res) {
  try {
    const voffset = Number(req.query.offset) || 0;
    const vlimit = Number(req.query.limit) || 10;

    const result = await getEmployees(voffset, vlimit);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!result || result.length === 0) {
      return res.status(200).json({
        data: [],
        message: 'No Data Found'
      });
    }

    return res.status(200).json({
      data: result,
      message: 'Employees fetched successfully'
    });

  } catch (error) {
    console.log('getAllEmployee Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  AddEditEmployee,
  getAllEmployee
};