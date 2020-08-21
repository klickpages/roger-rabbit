import pino from 'pino';
import { logErrorParams } from '../interfaces/IErrorLogger';

const logger = pino();

export default ({ message, error }: logErrorParams): void => {
  logger.error(message, { metadata: { message: error.message, stack: error.stack } });
};
