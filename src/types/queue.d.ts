import { Options } from 'amqplib';

type bindingObject = {
  exchange: string,
  routingKey: string,
}

export interface queueOptions {
  name: string,
  assertQueueOptions: Options.AssertQueue,
  bindings: Array<bindingObject>,
  prefetch: number | undefined,
}
