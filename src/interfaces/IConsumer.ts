import { Options } from 'amqplib';
import { bindingObject } from './IQueue';

interface AssertQueueWithRequeue extends Options.AssertQueue {
  requeue?: boolean
}
export interface consumerOptions {
  queue: {
    name: string
    options: AssertQueueWithRequeue
  }
  consumerTag: string
  bindings: Array<bindingObject>
  prefetch: number
}
