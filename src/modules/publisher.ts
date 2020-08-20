import { Channel as AmqpChannel } from 'amqplib';
import MessageHelper from '../helpers/message_helper';
import { ChannelError } from '../errors';
import debuggerLogger from '../utils/debugger_logger';
import { publisherOptions } from '../types/publisher';

export default class Publisher {
  private channel: AmqpChannel

  private CONTEXT_LOG: string

  constructor(channel: AmqpChannel) {
    this.channel = channel;
    this.CONTEXT_LOG = this.constructor.name;
  }

  public publish(options: publisherOptions): void {
    const content = MessageHelper.jsonToBuffer(options.message);
    const { message, exchange, routingKey } = options;
    debuggerLogger({
      context: this.CONTEXT_LOG,
      message: 'Publishing message...',
      metadata: {
        message,
        exchange,
        routingKey,
      },
    });

    const published = this.channel.publish(exchange, routingKey, content);

    if (!published) {
      throw new ChannelError({ logMessage: 'Channel buffer size is full.' });
    }

    debuggerLogger({
      context: this.CONTEXT_LOG,
      message: 'Message was published',
      metadata: {
        message,
        exchange,
        routingKey,
      },
    });
  }
}
