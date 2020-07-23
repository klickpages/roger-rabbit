const helpers = require('./helpers');

const Module = {};

Module.consume = (options, channel, callback) => {
  const { queue } = options;
  const metadata = {
    context: 'consumer',
    queue: queue.name,
  };

  return channel.consume(queue.name, async (receivedMessage) => {
    try {
      const message = helpers.bufferToJson(receivedMessage.content);

      metadata.message = message;

      await Promise.resolve(callback(message));

      channel.ack(receivedMessage);

      helpers.log('info', 'message was consumed', options, metadata);
    } catch (error) {
      helpers.log('error', error.message, options, metadata);
      const { requeue } = queue.options;

      channel.reject(receivedMessage, requeue === false ? requeue : true);
    }
    return receivedMessage;
  });
};

module.exports = Module;
