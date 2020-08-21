import debug from 'debug';
import { logDebugParams } from '../interfaces/IDebuggerLogger';

debug.disable();

export default ({ context, message, metadata = {} }: logDebugParams): void => {
  const debugMessage = {
    message,
    metadata,
  };
  debug(`roger-rabbit:${context}`)(debugMessage);
};
