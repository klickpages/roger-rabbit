const assertExchanges = require('./assertExchanges');

describe('assertExchanges', () => {
  describe('call assertExchanges with all exchanges provided', () => {
    let exchanges;
    let channel;
    let connection;

    beforeEach(() => {
      exchanges = [
        { name: 'user_events', type: 'direct' },
        { name: 'repo_events', type: 'topic', options: { durable: true } },
        { name: 'commit_events', type: 'fanout' },
      ];

      channel = {
        assertExchange: jest.fn().mockResolvedValue(),
      };

      connection = jest.fn().mockResolvedValue(channel);

      assertExchanges(connection)(exchanges);
    });

    test('call channel.assertExchange three times', () => {
      expect(channel.assertExchange).toHaveBeenCalledTimes(3);
    });

    test('call channel.assertExchange with first exchange', () => {
      expect(channel.assertExchange).toHaveBeenCalledWith('user_events', 'direct', {});
    });

    test('call channel.assertExchange with second exchange', () => {
      expect(channel.assertExchange).toHaveBeenCalledWith('repo_events', 'topic', { durable: true });
    });

    test('call channel.assertExchange with third exchange', () => {
      expect(channel.assertExchange).toHaveBeenCalledWith('commit_events', 'fanout', {});
    });
  });
});
