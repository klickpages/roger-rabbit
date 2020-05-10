const { defaultsDeep } = require('lodash');
const channelModule = require('./modules/channel');

module.exports = (connection, baseOptions) => async (consumerOptions, callback) => {
  const options = defaultsDeep({}, baseOptions, consumerOptions, { context: 'consumer' });
  const {
    bindings = [],
    prefetch,
    queue,
  } = options;

  const channel = await connection;

  await channel.assertQueue(queue.name, queue.options);
  await Promise.all(bindings.map((binding) => {
    const { exchange, routingKey } = binding;

    return channel.bindQueue(queue.name, exchange, routingKey);
  }));
  await channel.prefetch(parseInt(prefetch, 10) || 1);

  return channelModule.consume(options, channel, callback);
};
