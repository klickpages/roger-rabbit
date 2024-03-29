import {
  connect, Channel as AmqpChannel, ConsumeMessageFields,
} from 'amqplib';
import MessageHelper from '../helpers/message_helper';
import Consumer from './consumer';
import { consumerOptions } from '../interfaces/IConsumer';

const fields = {} as ConsumeMessageFields;

const messageReceived = {
  content: Buffer.from('test'),
  fields,
};

jest.mock('amqplib', () => ({
  connect: () => ({
    createChannel: () => ({
      consume: jest.fn()
        .mockImplementationOnce((_queueName, onMessage) => onMessage(null))
        .mockImplementation(
          (_queueName, onMessage) => onMessage(messageReceived),
        ),
      ack: jest.fn(),
      reject: jest.fn(),
    }),
  }),
}));

const mockCreate = jest.fn();
jest.mock('./queue', () => () => ({
  create: mockCreate,
}));

jest.mock('../helpers/message_helper');

jest.mock('../utils/debugger_logger');

describe('consume', () => {
  const createMockedConnection = connect as jest.MockedFunction<typeof connect>;

  let mockedChannel: AmqpChannel;

  const options: consumerOptions = {
    queue: {
      name: 'test',
      options: {},
    },
    bindings: [{ exchange: 'test', routingKey: 'test' }],
    prefetch: 0,
    consumerTag: 'test',
  };

  describe('when message is consumed', () => {
    const callback: jest.MockedFunction<typeof Function> = jest.fn()
      .mockResolvedValueOnce('firs call')
      .mockRejectedValueOnce('second call');
    let consumer: Consumer;

    beforeAll(async () => {
      mockedChannel = await (await createMockedConnection('')).createChannel();
      consumer = new Consumer(mockedChannel, options);
    });

    describe('and message is null', () => {
      beforeAll(async () => {
        await consumer.consume(callback);
      });

      it('should call Queue', () => {
        expect(mockCreate).toHaveBeenCalled();
      });

      it('should call MessageHelper.bufferToJson', () => {
        expect(MessageHelper.bufferToJson).not.toHaveBeenCalled();
      });

      it('should call callback function', () => {
        expect(callback).not.toHaveBeenCalled();
      });

      it('should call channel.ack', () => {
        expect(mockedChannel.ack).not.toHaveBeenCalled();
      });
    });

    describe('and promise resolves', () => {
      beforeAll(async () => {
        await consumer.consume(callback);
      });

      it('should call Queue', () => {
        expect(mockCreate).toHaveBeenCalled();
      });

      it('should call MessageHelper.bufferToJson', () => {
        expect(MessageHelper.bufferToJson).toHaveBeenCalledWith(messageReceived.content);
      });

      it('should call callback function with message content and fields', () => {
        expect(callback).toHaveBeenCalledWith(
          MessageHelper.bufferToJson(messageReceived.content),
          messageReceived.fields,
        );
      });

      it('should call channel.ack', () => {
        expect(mockedChannel.ack).toHaveBeenCalledWith(messageReceived);
      });
    });

    describe('and promise rejects', () => {
      beforeAll(async () => {
        await consumer.consume(callback);
      });

      it('should call MessageHelper.bufferToJson', () => {
        expect(MessageHelper.bufferToJson).toHaveBeenCalled();
      });

      it('should call channel.reject', () => {
        expect(mockedChannel.reject).toHaveBeenCalled();
      });
    });
  });
});
