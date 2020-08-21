import { Options } from 'amqplib';

export interface exchangeObject {
  name: string,
  type: string,
  options?: Options.AssertExchange,
}
