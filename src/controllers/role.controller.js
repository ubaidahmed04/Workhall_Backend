'use strict';

const { addEditRole, getRole } = require('../services/role.service');

async function AddEditRole(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditRole(req.body, actorId);

    if (!result) return res.status(404).json({ message: 'No Data Found' });

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      return res.status(400).json({
        message: result?.message || 'Failed to save role'
      });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Role saved successfully'
    });

  } catch (error) {
    console.log('AddEditRole Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getAllRoles(req, res) {
  try {
    const result = await getRole();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Roles fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.log('getAllRoles Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  AddEditRole,
  getAllRoles
};