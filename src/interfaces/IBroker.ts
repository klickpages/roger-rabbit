import { Connection as AmqpConnection, Channel as AmqpChannel, Replies } from 'amqplib';
import { exchangeObject } from './IExchange';
import { consumerOptions } from './IConsumer';
import { publisherOptions } from './IPublisher';

export interface brokerInit {
  assertExchanges(exchanges: Array<exchangeObject>): Promise<Array<Replies.AssertExchange>>,
  publish(options: publisherOptions): void,
  publishConfirm(options: publisherOptions): void,
  consume(options: consumerOptions, action: Function): Promise<Replies.Consume>,
  channels: channels,
}

export interface connections {
  publisher: AmqpConnection,
  consumer: AmqpConnection,
}

export interface channels {
  publisher: {
    default: AmqpChannel,
    confirmation: AmqpChannel,
  },
  consumer: {
    default: AmqpChannel,
  }
}

export interface brokerOptions {
  channelMax?: number,
  contexts?: {
    publisher?: {
      default?: boolean,
      confirmation?: boolean,
    },
    consumer?: {
      default?: boolean,
      confirmation?: false
    },
  },
}

export declare type contextString = 'publisher' | 'consumer'

export declare type contextArray = Array<contextString>
