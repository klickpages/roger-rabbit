import { Options } from 'amqplib';
import { bindingObject } from './IQueue';

export interface consumerOptions {
  queue: {
    name: string,
    options: Options.AssertQueue,
    requeue: boolean,
  },
  bindings: Array<bindingObject>,
  prefetch: number,
}
