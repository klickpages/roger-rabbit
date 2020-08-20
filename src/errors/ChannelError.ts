import { RogerRabbitError, rogerRabbitErrorParams } from './RogerRabbitError';

export default class ChannelError extends RogerRabbitError {
  constructor({ logMessage, error } : rogerRabbitErrorParams) {
    super({ logMessage, error });
  }
}
