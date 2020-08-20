import { Connection as AmqpConnection, Channel as AmqpChannel, Replies } from 'amqplib';
import { exchangeObject } from './exchange';
import { publisherOptions } from './publisher';
import { consumerOptions } from './consumer';

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

type brokerOptions = {
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

type contextString = 'publisher' | 'consumer'

type contextArray = Array<contextString>
