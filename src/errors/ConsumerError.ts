import { RogerRabbitError, rogerRabbitErrorParams } from './RogerRabbitError';

export default class ConsumerError extends RogerRabbitError {
  constructor({ logMessage, error } : rogerRabbitErrorParams) {
    super({ logMessage, error });
  }
}
