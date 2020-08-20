import {
  Channel as AmqpChannel,
  ConfirmChannel as AmqpConfirmChannel,
} from 'amqplib';

export interface channelTypes {
  default: () => Promise<AmqpChannel>,
  confirmation: () => Promise<AmqpConfirmChannel>,
}

type channelStringTypes = 'default' | 'confirmation';

type channelContexts = 'consumer' | 'publisher'
