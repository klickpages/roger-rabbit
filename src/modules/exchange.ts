import { Channel as AmqpChannel, Replies } from 'amqplib';
import { exchangeObject } from '../types/exchange';
import debuggerLogger from '../utils/debugger_logger';
import { ExchangeError } from '../errors';

const CONTEXT_LOG = 'exchange';
export default class Exchange {
  private channel: AmqpChannel

  constructor(channel: AmqpChannel) {
    this.channel = channel;
  }

  public assert(exchanges: Array<exchangeObject>): Promise<Array<Replies.AssertExchange>> {
    debuggerLogger({ context: CONTEXT_LOG, message: 'Asserting exchanges.' });

    return Promise.all(exchanges.map((exchange: exchangeObject) => {
      const { name, type, options } = exchange;
      debuggerLogger({
        context: CONTEXT_LOG, message: `Creating exchange: ${name}`, metadata: exchange,
      });

      return this.channel.assertExchange(name, type, options)
        .catch((error) => {
          throw new ExchangeError({
            logMessage: `Error on create exchange ${name}.${type}.${JSON.stringify(options)}`,
            error,
          });
        });
    }));
  }
}
