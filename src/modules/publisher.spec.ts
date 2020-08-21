import { connect, Channel as AmqpChannel } from 'amqplib';
import Publisher from './publisher';
import { ChannelError } from '../errors';
import { publisherOptions } from '../interfaces/IPublisher';

jest.mock('amqplib', () => ({
  connect: () => ({
    createChannel: () => ({
      publish: jest.fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false),
    }),
  }),
}));

jest.mock('../helpers/message_helper');

jest.mock('../utils/debugger_logger');

describe('publish', () => {
  const createMockedConnection = connect as jest.MockedFunction<typeof connect>;
  let mockedChannel: AmqpChannel;
  let publisher: Publisher;
  const options: publisherOptions = {
    exchange: 'test',
    routingKey: 'test',
    message: {
      test: 'test',
    },
  };

  describe('when message is publish', () => {
    beforeAll(async () => {
      mockedChannel = await (await createMockedConnection('')).createChannel();
      publisher = new Publisher(mockedChannel);
    });
    describe('and publish return true', () => {
      beforeAll(() => {
        publisher.publish(options);
      });

      it('should call channel.publish', () => {
        expect(mockedChannel.publish)
          .toHaveBeenCalledWith(options.exchange, options.routingKey, options.message);
      });
    });

    describe('and publish return false(buffer full)', () => {
      it('should throw error', () => {
        expect(() => publisher.publish(options)).toThrow(new ChannelError({
          logMessage: 'Channel buffer size is full.',
        }));
      });

      it('should call channel.publish', () => {
        expect(mockedChannel.publish)
          .toHaveBeenCalledWith(options.exchange, options.routingKey, options.message);
      });
    });
  });
});
