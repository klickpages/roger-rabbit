import Broker from './broker';
import { create as mockCreateConnection } from './modules/__mocks__/connection';
import { channelTypes } from './modules/__mocks__/channel';
import { ChannelError } from './errors';
import { assert as mockAssertExchange } from './modules/__mocks__/exchange';
import { publish as mockPublish } from './modules/__mocks__/publisher';
import { consume as mockConsume } from './modules/__mocks__/consumer';

jest.mock('./utils/debugger_logger');
jest.mock('./modules/connection', () => () => ({ create: mockCreateConnection }));
jest.mock('./modules/channel', () => () => ({
  create: (type: 'default' | 'confirmation') => channelTypes[type](),
}));
jest.mock('./modules/exchange', () => () => ({
  assert: mockAssertExchange,
}));
jest.mock('./modules/publisher', () => () => ({ publish: mockPublish }));
jest.mock('./modules/consumer', () => () => ({
  consume: mockConsume,
}));

describe('Broker', () => {
  let broker: Broker;

  describe('init', () => {
    beforeAll(async () => {
      await new Broker('',
        {
          publisher: { confirmation: true, default: false },
        }).init();
    });

    it('should call create connection', () => {
      expect(mockCreateConnection).toHaveBeenCalledTimes(2);
    });

    it('should call default create channel', () => {
      expect(channelTypes.default).toHaveBeenCalledTimes(1);
    });

    it('should call confirmation create channel', () => {
      expect(channelTypes.confirmation).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
  });

  describe('eventEmitter', () => {
    describe('when error is emitted', () => {
      beforeAll(async () => {
        broker = await new Broker('').init();
        broker.channels.publisher.default.emit('error');
      });

      it('should close connection', () => {
        expect(broker.connections.publisher.close).toHaveBeenCalledTimes(1);
      });

      it('should call create connection again', () => {
        expect(mockCreateConnection).toHaveBeenCalledTimes(3);
      });

      it('should call create channel again', () => {
        expect(channelTypes.default).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('assertExchanges', () => {
    describe('when publisher channel does not exists', () => {
      beforeAll(async () => {
        broker = await new Broker('', {
          publisher: {
            default: false,
          },
        }).init();
      });
      it('should throw channel error', async () => {
        expect(() => broker.assertExchanges([])).toThrow(new ChannelError({
          message: 'Publisher channels was not created.',
        }));
      });
    });
    describe('when publisher channel exists', () => {
      beforeAll(async () => {
        broker = await new Broker('').init();
        await broker.assertExchanges([
          {
            name: 'exchange', type: 'test',
          },
        ]);
      });

      it('should call Exchange.assert', () => {
        expect(mockAssertExchange).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('publish', () => {
    describe('when channel default is not created', () => {
      beforeAll(async () => {
        broker = await new Broker('', {
          publisher: {
            default: false,
          },
        }).init();
      });

      it('should throw channel error', () => {
        expect(() => broker
          .publish({ exchange: 'exchange', message: 'test', routingKey: 'routingKey' })).toThrow(
          new ChannelError({
            message: 'Publish default channel was not created.',
          }),
        );
      });
    });

    describe('when chanel default exists', () => {
      beforeAll(async () => {
        broker = await new Broker('').init();
        broker.publish({ exchange: 'exchange', message: 'test', routingKey: 'routingKey' });
      });

      it('should call Publisher.publish', () => {
        expect(mockPublish).toHaveBeenCalledTimes(1);
      });
    });

    afterAll(() => mockPublish.mockClear());
  });

  describe('publishConfirm', () => {
    describe('when chanel confirmation exists', () => {
      beforeAll(async () => {
        broker = await new Broker('', {
          publisher: {
            confirmation: true,
            default: false,
          },
        }).init();
        broker.publishConfirm({ exchange: 'exchange', message: 'test', routingKey: 'routingKey' });
      });

      it('should call Publisher.publish', () => {
        expect(mockPublish).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('consume', () => {
    beforeAll(async () => {
      broker = await new Broker('').init();
      await broker.consume({
        bindings: [],
        prefetch: 1,
        queue: {
          name: 'queue',
          requeue: false,
          options: {},
        },
      }, () => {});
    });

    it('should call Consumer.consume', () => {
      expect(mockConsume).toHaveBeenCalledTimes(1);
    });
  });
});
