import { RogerRabbitError } from './RogerRabbitError';
import { rogerRabbitErrorParams } from '../interfaces/IRogerRabbitError';

export default class ConsumerError extends RogerRabbitError {
  constructor({ logMessage, error } : rogerRabbitErrorParams) {
    super({ logMessage, error });
  }
}
