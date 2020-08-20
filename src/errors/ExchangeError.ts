import { RogerRabbitError, rogerRabbitErrorParams } from './RogerRabbitError';

export default class ExchangeError extends RogerRabbitError {
  constructor({ logMessage, error }: rogerRabbitErrorParams) {
    super({ logMessage, error });
  }
}
