'use strict';

const httpStatus = require('../constants/httpStatus');
const { addBranch, getBranches } = require('../services/branch.service');

async function AddEditBranch(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addBranch(req.body, actorId);

    // ✅ DB error — sabse pehle check karo
    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    // ✅ Service-level validation error
    if (result?.status === false) {
      return res.status(400).json({ message: result?.message || 'Failed to save branch' });
    }

    // ✅ Null/undefined check
    if (result === null || result === undefined) {
      return res.status(404).json({ message: 'No Data Found' });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Branch saved successfully'
    });

  } catch (error) {
    console.error('AddEditBranch Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getAllBranch(req, res) {
  try {
    const result = await getBranches();

    //  DB error pehle
    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Branches fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.error('getAllBranch Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  AddEditBranch,
  getAllBranch
};