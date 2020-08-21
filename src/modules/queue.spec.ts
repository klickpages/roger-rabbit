import { connect, Channel as AmqpChannel } from 'amqplib';
import { QueueError } from '../errors';
import Queue from './queue';
import { queueOptions } from '../interfaces/IQueue';

jest.mock('amqplib', () => ({
  connect: () => ({
    createChannel: () => ({
      assertQueue: jest.fn()
        .mockResolvedValueOnce('first call')
        .mockRejectedValueOnce('second call')
        .mockResolvedValueOnce('third call'),
      bindQueue: jest.fn()
        .mockResolvedValueOnce('first call')
        .mockRejectedValueOnce('second call'),
    }),
  }),
}));

jest.mock('../utils/debugger_logger');

describe('create', () => {
  const createMockedConnection = connect as jest.MockedFunction<typeof connect>;
  let mockedChannel: AmqpChannel;
  let queue: Queue;
  const options: queueOptions = {
    name: 'queue',
    assertQueueOptions: {},
    bindings: [
      {
        exchange: 'exchange',
        routingKey: 'routingKey',
      },
    ],
    prefetch: 0,
  };

  describe('when queue is created', () => {
    beforeAll(async () => {
      mockedChannel = await (await createMockedConnection('')).createChannel();
      queue = new Queue(mockedChannel, options);
    });

    describe('and promises resolves', () => {
      beforeAll(async () => {
        await queue.create();
      });

      it('should call assertQueue', () => {
        expect(mockedChannel.assertQueue)
          .toHaveBeenCalledWith(options.name, options.assertQueueOptions);
      });

      it('should call bindQueue', () => {
        expect(mockedChannel.bindQueue).toHaveBeenCalledWith(
          options.name, options.bindings[0].exchange, options.bindings[0].routingKey,
        );
      });
    });

    describe('and assertQueue promise rejects', () => {
      it('should throw error', async () => {
        await expect(queue.create()).rejects.toThrow(new QueueError({
          logMessage: 'Error on Queue assert.',
        }));
      });

      it('should call bindQueue one time', () => {
        expect(mockedChannel.bindQueue).toHaveBeenCalledTimes(1);
      });
    });

    describe('and bindQueue promise rejects', () => {
      it('should throw error', async () => {
        await expect(queue.create()).rejects.toThrow(new QueueError({
          logMessage: 'Error on Queue bind.',
        }));
      });
    });
  });
});
