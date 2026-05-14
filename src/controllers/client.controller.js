'use strict';

const httpStatus = require('../constants/httpStatus');
const { addClient ,getClients} = require('../services/client.service');

async function AddEditClient(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addClient(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}

async function getAllClients(req, res) {
    const result = await getClients();
    if (!result || result.length === 0) {
        return res.success({
            data: [],
            message: 'No Data Found'
        }, httpStatus.OK);
    }
    return res.success({
        data: result,
        message: 'Skills fetched successfully'
    }, httpStatus.OK);
}

module.exports = {
  AddEditClient,
  getAllClients
};