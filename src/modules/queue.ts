import { Channel } from 'amqplib';
import debuggerLogger from '../utils/debugger_logger';
import { QueueError } from '../errors';
import { queueOptions, bindingObject } from '../interfaces/IQueue';

class Queue {
  private channel: Channel;

  private options: queueOptions;

  private CONTEXT_LOG: string;

  constructor(channel: Channel, options: queueOptions) {
    this.channel = channel;
    this.options = options;
    this.CONTEXT_LOG = this.constructor.name.toLocaleLowerCase();
  }

  public async create(): Promise<void> {
    await this.assert();
    await this.bind();
    debuggerLogger({
      context: this.CONTEXT_LOG,
      message: 'Queue created.',
    });
  }

  private async assert(): Promise<void> {
    try {
      const { name, assertQueueOptions } = this.options;
      await this.channel.assertQueue(name, assertQueueOptions);
      debuggerLogger({
        context: this.CONTEXT_LOG,
        message: 'Queue asserted.',
        metadata: {
          name, assertQueueOptions,
        },
      });
    } catch (error) {
      throw new QueueError({ logMessage: 'Error on Queue assert.', error });
    }
  }

  private async bind(): Promise<void> {
    try {
      const { bindings = [], name: queueName } = this.options;
      await Promise.all(bindings.map((binding : bindingObject) => {
        const { exchange, routingKey } = binding;
        return this.channel.bindQueue(queueName, exchange, routingKey);
      }));
      debuggerLogger({
        context: this.CONTEXT_LOG,
        message: 'Queue binded.',
        metadata: {
          bindings,
          queueName,
        },
      });
    } catch (error) {
      throw new QueueError({ logMessage: 'Error on Queue bind.', error });
    }
  }
}

export default Queue;
