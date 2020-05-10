const amqp = require('amqplib');
const helpers = require('./helpers');

const Module = {};
const channels = {};

Module.connect = async (options) => {
  try {
    const { host, context } = options;

    if (channels[host] && channels[host][context]) {
      return new Promise(resolve => resolve(channels[host][context]));
    }

    const connection = await amqp.connect(host);
    const channel = await connection.createConfirmChannel();

    channels[host] = channel[host] ? channels[host] : {};
    channels[host][context] = channel;

    return channels[host][context];
  } catch (error) {
    helpers.log('error', error.message, options);

    return error;
  }
};

module.exports = Module;
