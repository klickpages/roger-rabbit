import { RogerRabbitError } from './RogerRabbitError';
import { rogerRabbitErrorParams } from '../interfaces/IRogerRabbitError';

export default class ChannelError extends RogerRabbitError {
  constructor({ message, error } : rogerRabbitErrorParams) {
    super({ message, error });
  }
}
