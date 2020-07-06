const connection = require('./modules/connection');

module.exports = baseOptions => context => connection.connect({ ...baseOptions, context });
