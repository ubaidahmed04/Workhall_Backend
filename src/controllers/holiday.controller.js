'use strict';

const { addEditHoliday, getHoliday } = require('../services/holiday.service');

async function AddEditHoliday(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditHoliday(req.body, actorId);

    if (!result) return res.status(404).json({ message: 'No Data Found' });

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (result?.status === false) {
      return res.status(400).json({
        message: result?.message || 'Failed to save holiday'
      });
    }

    return res.status(200).json({
      data: result,
      message: result?.message || 'Holiday saved successfully'
    });

  } catch (error) {
    console.log('AddEditHoliday Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getAllHoliday(req, res) {
  try {
    const result = await getHoliday();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.status(503).json({ message: 'Database not connected' });
    }

    return res.status(200).json({
      data: result || [],
      message: result?.length ? 'Holiday fetched successfully' : 'No Data Found'
    });

  } catch (error) {
    console.log('getAllHoliday Error =>', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  AddEditHoliday,
  getAllHoliday
};