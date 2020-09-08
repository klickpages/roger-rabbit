import debuggerLogger from '../utils/debugger_logger';
import { rogerRabbitErrorParams } from '../interfaces/IRogerRabbitError';

export abstract class RogerRabbitError extends Error {
  private CONTEXT_LOG: string

  constructor({ message, error }: rogerRabbitErrorParams) {
    const errorMessage = error instanceof Error
      ? error.message
      : message;

    super(errorMessage);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.stack = error instanceof Error ? error.stack : this.stack;
    this.CONTEXT_LOG = `error:${this.constructor.name.toLowerCase()}`;

    debuggerLogger({
      context: this.CONTEXT_LOG,
      message: errorMessage,
      metadata: {
        error: {
          stack: this.stack,
        },
      },
    });
  }
}
