import { Connection as AmqpConnection, Channel as AmqpChannel } from 'amqplib';
import Publisher from '../modules/publisher';

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
  heartbeat?: number,
  publisher?: {
    default?: boolean,
    confirmation?: boolean,
  },
  consumer?: {
    default?: boolean,
    confirmation?: false
  },
  prefetch?: number,
}

export interface publisherInstances {
  default?: Publisher,
  confirmation?: Publisher,
}

export declare type contextString = 'publisher' | 'consumer'

export declare type contextArray = Array<contextString>
