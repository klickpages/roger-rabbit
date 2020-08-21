import { Channel as AmqpChannel, Replies } from 'amqplib';
import debuggerLogger from '../utils/debugger_logger';
import { ExchangeError } from '../errors';
import { exchangeObject } from '../interfaces/IExchange';

export default class Exchange {
  private channel: AmqpChannel

  private CONTEXT_LOG: string

  constructor(channel: AmqpChannel) {
    this.channel = channel;
    this.CONTEXT_LOG = this.constructor.name.toLocaleLowerCase();
  }

  public assert(exchanges: Array<exchangeObject>): Promise<Array<Replies.AssertExchange>> {
    debuggerLogger({ context: this.CONTEXT_LOG, message: 'Asserting exchanges.' });

    return Promise.all(exchanges.map((exchange: exchangeObject) => {
      const { name, type, options } = exchange;
      debuggerLogger({
        context: this.CONTEXT_LOG, message: `Creating exchange: ${name}`, metadata: exchange,
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
