import errorLogger from '../utils/error_logger';

export type rogerRabbitErrorParams = {
  logMessage: string,
  error?: Error,
}

export abstract class RogerRabbitError extends Error {
  constructor({ logMessage, error } : rogerRabbitErrorParams) {
    const message = error instanceof Error
      ? error.message
      : logMessage;

    super(message);
    this.name = this.constructor.name;
    this.stack = error instanceof Error ? error.stack : this.stack;
    errorLogger({ message: logMessage, error });
  }
}
