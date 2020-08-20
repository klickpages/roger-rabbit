import { RogerRabbitError, rogerRabbitErrorParams } from './RogerRabbitError';

export default class QueueError extends RogerRabbitError {
  constructor({ logMessage, error }: rogerRabbitErrorParams) {
    super({ logMessage, error });
  }
}
