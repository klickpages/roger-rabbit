import { RogerRabbitError } from './RogerRabbitError';
import { rogerRabbitErrorParams } from '../interfaces/IRogerRabbitError';

export default class ConsumerError extends RogerRabbitError {
  constructor({ message, error } : rogerRabbitErrorParams) {
    super({ message, error });
  }
}
