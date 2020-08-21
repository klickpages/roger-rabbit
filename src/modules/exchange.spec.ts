import { connect, Channel as AmqpChannel, Replies } from 'amqplib';
import Exchange from './exchange';
import { ExchangeError } from '../errors';

jest.mock('amqplib', () => ({
  connect: () => ({
    createChannel: () => ({
      assertExchange: jest.fn()
        .mockResolvedValueOnce('first call')
        .mockResolvedValueOnce('second call')
        .mockResolvedValueOnce('third call')
        .mockRejectedValueOnce('third call'),
    }),
  }),
}));

jest.mock('../utils/debugger_logger');

describe('assert', () => {
  const createMockedConnection = connect as jest.MockedFunction<typeof connect>;
  let mockedChannel: AmqpChannel;

  const options = { durable: true };
  const exchanges = [
    { name: 'exchange1', type: 'direct', options },
    { name: 'exchange2', type: 'direct', options },
  ];

  beforeAll(async () => {
    mockedChannel = await (await createMockedConnection('')).createChannel();
  });

  describe('when promise resolves', () => {
    beforeAll(async () => {
      await new Exchange(mockedChannel).assert(exchanges);
    });

    it('should call channel.assertExchange 2 times', () => {
      expect(mockedChannel.assertExchange).toHaveBeenCalledTimes(2);
    });
  });
  describe('when promise rejects', () => {
    let assertRejected: Promise<Array<Replies.AssertExchange>>;

    beforeAll(() => {
      assertRejected = new Exchange(mockedChannel).assert(exchanges);
    });
    it('should throw Exchange Error with right params', async () => {
      await expect(assertRejected).rejects.toThrow(new ExchangeError({
        logMessage: `Error on create exchange exchange2.direct.${JSON.stringify(options)}`,
      }));
    });
  });
});
