const publisher = require('./publisher');
const helpers = require('./modules/helpers');

describe('publisher', () => {
  let options;
  let baseOptions;
  let message;
  let channel;
  let connection;

  beforeEach(() => {
    baseOptions = {
      host: 'host',
      disableLog: true,
    };

    options = {};

    message = { message: true };

    channel = {
      connection: {
        close: jest.fn(),
      },
    };

    connection = jest.fn().mockResolvedValue(channel);
  });

  describe('when the message was published', () => {
    beforeEach(async (done) => {
      channel.publish = jest.fn().mockReturnValue(true);

      jest.spyOn(helpers, 'log');

      await publisher(connection, baseOptions)({
        exchange: 'exchange.name',
        routingKey: 'routing.key',
        message,
        options,
      });

      done();
    });

    test('call channel.publish with correct params', () => {
      expect(channel.publish).toHaveBeenCalledWith(
        'exchange.name',
        'routing.key',
        helpers.jsonToBuffer(message),
        options,
      );
    });

    test('call log info', () => {
      expect(helpers.log).toHaveBeenCalledWith(
        'info',
        'message is published',
        expect.any(Object),
        {
          context: 'publisher',
          exchange: 'exchange.name',
          routingKey: 'routing.key',
          message,
        },
      );
    });
  });

  describe('when the message was not published', () => {
    beforeEach(async (done) => {
      try {
        channel.publish = jest.fn().mockReturnValue(false);

        jest.spyOn(helpers, 'log');

        await publisher(connection, baseOptions)({
          exchange: 'exchange.name',
          routingKey: 'routing.key',
          message,
          options,
        });
      } catch (error) {
        done();
      }
    });

    test('call channel.publish with correct params', () => {
      expect(channel.publish).toHaveBeenCalledWith(
        'exchange.name',
        'routing.key',
        helpers.jsonToBuffer(message),
        options,
      );
    });

    test('call log error', () => {
      expect(helpers.log).toHaveBeenCalledWith(
        'error',
        'Message can not be published',
        expect.any(Object),
        {
          context: 'publisher',
          exchange: 'exchange.name',
          routingKey: 'routing.key',
          message,
        },
      );
    });
  });
});
