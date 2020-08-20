import { Options } from 'amqplib';
import { bindingObject } from './queue';

export type consumerOptions = {
  queue: {
    name: string,
    options: Options.AssertQueue,
    requeue: boolean,
  },
  bindings: Array<bindingObject>,
  prefetch: number,
}
