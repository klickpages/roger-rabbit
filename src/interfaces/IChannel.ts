import {
  Channel as AmqpChannel,
  ConfirmChannel as AmqpConfirmChannel,
} from 'amqplib';

export interface channelTypes {
  default: () => Promise<AmqpChannel>,
  confirmation: () => Promise<AmqpConfirmChannel>,
}

export declare type channelStringTypes = 'default' | 'confirmation';

export declare type channelContexts = 'consumer' | 'publisher'
