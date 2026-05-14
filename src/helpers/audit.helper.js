'use strict';

const moment = require('moment');

function nowDb() {
  return moment().toDate();
}

module.exports = { nowDb };
