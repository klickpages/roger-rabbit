const Module = {};

Module.jsonToBuffer = message => Buffer.from(JSON.stringify(message));

Module.bufferToJson = buffer => JSON.parse(buffer.toString());

Module.log = (level, logMessage, options, metadata) => {
  if (!options.disableLog) {
    options.logger[level](logMessage, metadata);
  }
};

module.exports = Module;
