const axios = require('axios');

const instance = axios.create({
  timeout: 10 * 1000,
});

exports.http = instance;

exports.output = (type = 'default') => ({
  type,
  timestamp: Date.now(),
});
