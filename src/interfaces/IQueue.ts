import { Options } from 'amqplib';

export interface queueOptions {
  name: string,
  assertQueueOptions: Options.AssertQueue,
  bindings: Array<bindingObject>,
  prefetch: number | undefined,
}

export declare type bindingObject = {
  exchange: string,
  routingKey: string,
}
