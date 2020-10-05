import { connect, Connection as AmqpConnection, Channel as AmqpChannel } from 'amqplib';
import Channel from './channel';
import debuggerLogger from '../utils/debugger_logger';
import { ChannelError } from '../errors';
import { channelStringTypes, channelContexts } from '../interfaces/IChannel';

jest.mock('amqplib', () => ({
  connect: () => ({
    createChannel: jest.fn()
      .mockResolvedValueOnce({ prefetch: jest.fn() })
      .mockResolvedValueOnce({ prefetch: jest.fn() })
      .mockRejectedValueOnce('third call'),
    createConfirmChannel: jest.fn()
      .mockResolvedValueOnce({ prefetch: jest.fn() })
      .mockRejectedValueOnce('second call'),
  }),
}));
jest.mock('../utils/debugger_logger');

describe('create', () => {
  const createMockedConnection = connect as jest.MockedFunction<typeof connect>;
  let mockedConnection: AmqpConnection;
  let channel: Channel;
  let channelType: channelStringTypes;
  const channelContext: channelContexts = 'publisher';
  const prefetch = 1;

  beforeAll(async () => {
    mockedConnection = await createMockedConnection('');
    channel = new Channel(mockedConnection);
  });
  describe('when channel type is not given', () => {
    beforeAll(async () => {
      await channel.create(undefined, channelContext, prefetch);
    });

    describe('and promise resolve', () => {
      it('should call createChannel from amqplib', () => {
        expect(mockedConnection.createChannel).toHaveBeenCalled();
      });
    });
  });
  describe('when channel type is default', () => {
    describe('and promise resolve', () => {
      beforeAll(async () => {
        channelType = 'default';
        await channel.create(channelType, channelContext, prefetch);
      });

      it('should call createChannel from amqplib', () => {
        expect(mockedConnection.createChannel).toHaveBeenCalled();
      });

      it('should call debuggerLogger with right params', () => {
        expect(debuggerLogger).toHaveBeenCalledWith({
          message: `Channel ${channelContext}.${channelType} created.`, context: 'channel',
        });
      });
    });

    describe('and promise reject', () => {
      let channelRejected: Promise<AmqpChannel>;
      beforeAll(() => {
        channelType = 'default';
        channelRejected = channel.create(channelType, channelContext, prefetch);
      });

      it('should trhow ChannelError with right param', async () => {
        await expect(channelRejected).rejects.toThrow(new ChannelError({
          message: `Error in ${channelContext}.${channelType} create channel.`,
        }));
      });
    });
  });

  describe('when channel type is confirmation', () => {
    describe('and promise resolve', () => {
      beforeAll(async () => {
        channelType = 'confirmation';
        await channel.create(channelType, channelContext, prefetch);
      });

      it('should call createConfirmChannel from amqplib', () => {
        expect(mockedConnection.createConfirmChannel).toHaveBeenCalled();
      });

      it('should call debuggerLogger with right params', () => {
        expect(debuggerLogger).toHaveBeenCalledWith({
          message: `Channel ${channelContext}.${channelType} created.`, context: 'channel',
        });
      });
    });

    describe('and promise reject', () => {
      let channelRejected: Promise<AmqpChannel>;
      beforeAll(() => {
        channelType = 'confirmation';
        channelRejected = channel.create(channelType, channelContext, prefetch);
      });

      it('should trhow ChannelError with right param', async () => {
        await expect(channelRejected).rejects.toThrow(new ChannelError({
          message: `Error in ${channelContext}.${channelType} create channel.`,
        }));
      });
    });
  });
});
