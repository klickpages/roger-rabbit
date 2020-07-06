const helpers = require('./modules/helpers');

module.exports = (connection, baseOptions) => (
  async ({
    exchange = '',
    routingKey = '',
    message = {},
    options = {},
  }) => {
    const context = 'publisher';
    const content = helpers.jsonToBuffer(message);
    const metadata = {
      context,
      message,
      exchange,
      routingKey,
    };
    const channel = await connection();

    const published = channel.publish(exchange, routingKey, content, options);

    if (!published) {
      helpers.log('error', 'Message can not be published', baseOptions, metadata);

      throw Error('Message can not be published');
    }

    helpers.log('info', 'message is published', baseOptions, metadata);

    return message;
  }
);
