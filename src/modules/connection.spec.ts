import { connect, Connection as AmqpConnection } from 'amqplib';
import Connection from './connection';
import { ConnectionError } from '../errors';
import debuggerLogger from '../utils/debugger_logger';

jest.mock('amqplib', () => ({
  connect: jest.fn()
    .mockResolvedValueOnce('first call')
    .mockRejectedValueOnce('second call')
    .mockResolvedValueOnce('third call')
    .mockRejectedValueOnce('fourth call'),
}));

jest.mock('../utils/debugger_logger');

describe('create', () => {
  describe('when context and channel max is not given', () => {
    const host = 'host';
    const channelMax = 3;
    const heartbeat = 30;
    const connection = new Connection(host);
    describe('and promise resolves', () => {
      beforeAll(async () => {
        await connection.create();
      });
      it('should call connect from amqplib', () => {
        expect(connect).toHaveBeenCalledWith(`${host}?channelMax=${channelMax}&heartbeat=${heartbeat}`);
      });

      it('should call debugger_logger', () => {
        expect(debuggerLogger).toHaveBeenCalledWith({
          context: 'connection',
          message: 'Connection default created.',
        });
      });
    });
    describe('and promise rejects', () => {
      let connectionThrowed: Promise<AmqpConnection>;
      beforeAll(() => {
        connectionThrowed = connection.create();
      });

      it('should throw error', async () => {
        await expect(connectionThrowed).rejects.toThrow(new ConnectionError({
          message: 'Error in create default connection.',
        }));
      });
    });
  });

  describe('when context and channel max is given', () => {
    const host = 'host';
    const channelMax = 2;
    const heartbeat = 60;
    const contextConnection = 'publisher';
    const connection = new Connection(host, channelMax, heartbeat);
    describe('and promise resolves', () => {
      beforeAll(async () => {
        await connection.create(contextConnection);
      });
      it('should call connect from amqplib', () => {
        expect(connect).toHaveBeenCalledWith(`${host}?channelMax=${channelMax}&heartbeat=${heartbeat}`);
      });

      it('should call debugger_logger', () => {
        expect(debuggerLogger).toHaveBeenCalledWith({
          context: 'connection',
          message: `Connection ${contextConnection} created.`,
        });
      });
    });
    describe('and promise rejects', () => {
      let connectionThrowed: Promise<AmqpConnection>;
      beforeAll(() => {
        connectionThrowed = connection.create(contextConnection);
      });

      it('should throw error', async () => {
        await expect(connectionThrowed).rejects.toThrow(new ConnectionError({
          message: `Error in create ${contextConnection} connection.`,
        }));
      });
    });
  });
});
