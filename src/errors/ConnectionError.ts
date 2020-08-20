import { RogerRabbitError, rogerRabbitErrorParams } from './RogerRabbitError';

export default class ConnectionError extends RogerRabbitError {
  constructor({ logMessage, error } : rogerRabbitErrorParams) {
    super({ logMessage, error });
  }
}
