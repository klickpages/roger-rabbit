import { RogerRabbitError } from './RogerRabbitError';
import { rogerRabbitErrorParams } from '../interfaces/IRogerRabbitError';

export default class ExchangeError extends RogerRabbitError {
  constructor({ logMessage, error }: rogerRabbitErrorParams) {
    super({ logMessage, error });
  }
}
