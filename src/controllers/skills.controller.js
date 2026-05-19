'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditSkills ,getSkills} = require('../services/skills.service');

async function AddEditSkill(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addEditSkills(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}

async function getAllSkills(req, res) {
    const result = await getSkills();
   if (!Array.isArray(result) || result.length === 0){
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
  AddEditSkill,
  getAllSkills
};