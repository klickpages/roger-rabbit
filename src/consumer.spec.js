const { defaultsDeep } = require('lodash');
const consumer = require('./consumer');
const channelModule = require('./modules/channel');

describe('consumer', () => {
  let consumerOptions;
  let baseOptions;
  let channel;
  let connection;
  let callback;

  beforeEach((done) => {
    const assertQueue = jest.fn().mockResolvedValue();
    const bindQueue = jest.fn().mockResolvedValue();

    channel = {
      assertQueue,
      bindQueue,
      prefetch: jest.fn(),
    };

    consumerOptions = {
      queue: {
        name: 'queue.name',
        options: {},
      },
      bindings: [
        { exchange: 'user_events', routingKey: 'user_events.routingKey' },
        { exchange: 'repo_events', routingKey: 'repo_events.routingKey' },
      ],
    };

    baseOptions = {
      host: 'host',
      exchange: {
        name: 'exchange.name',
        type: 'topic',
        options: {},
      },
    };

    connection = jest.fn().mockResolvedValue(channel);

    callback = jest.fn();

    jest.spyOn(channelModule, 'consume').mockImplementation(() => {});

    consumer(connection, baseOptions)(consumerOptions, callback).then(() => done());
  });

  test('call channel.assertQueue', () => {
    expect(channel.assertQueue).toHaveBeenCalledWith('queue.name', {});
  });

  test('call channel.bindQueue two times', () => {
    expect(channel.bindQueue).toHaveBeenCalledTimes(2);
  });

  test('call channel.bindQueue with first binding options', () => {
    expect(channel.bindQueue).toHaveBeenCalledWith('queue.name', 'user_events', 'user_events.routingKey');
  });

  test('call channel.bindQueue with second binding options', () => {
    expect(channel.bindQueue).toHaveBeenCalledWith('queue.name', 'repo_events', 'repo_events.routingKey');
  });

  test('call consume', () => {
    expect(channelModule.consume).toHaveBeenCalledWith(
      defaultsDeep({}, baseOptions, consumerOptions, { context: 'consumer' }),
      expect.any(Object),
      callback,
    );
  });
});
