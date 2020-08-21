import debuggerLogger from '../utils/debugger_logger';
import { rogerRabbitErrorParams } from '../interfaces/IRogerRabbitError';

export abstract class RogerRabbitError extends Error {
  private CONTEXT_LOG: string

  constructor({ logMessage, error }: rogerRabbitErrorParams) {
    const message = error instanceof Error
      ? error.message
      : logMessage;

    super(message);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.stack = error instanceof Error ? error.stack : this.stack;
    this.CONTEXT_LOG = `error:${this.constructor.name.toLowerCase()}`;

    debuggerLogger({
      context: this.CONTEXT_LOG,
      message,
      metadata: {
        error: {
          stack: this.stack,
        },
      },
    });
  }
}
