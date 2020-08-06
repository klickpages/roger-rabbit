import debug from 'debug';

class Helpers {
  jsonToBuffer(message : string) : Buffer {
    return Buffer.from(JSON.stringify(message));
  }

  bufferToJson(buffer : Buffer) : string {
    return JSON.parse(buffer.toString());
  }

  log(level : string, context : string, message : string, metadata : Object = {}) : void {
    const logMessage = {
      message,
      metadata
    };

    debug(`roger-rabit:${level}:${context}`)(logMessage);
  }
}

export default new Helpers();
