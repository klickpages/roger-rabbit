import { EventEmitter } from 'events';

const emmiter = new EventEmitter();

const channelsDefaultFunctions = {
  assertExchanges: jest.fn(),
  assertQueue: jest.fn(),
  bindQueue: jest.fn(),
  publish: jest.fn(),
  on: emmiter.on,
  emit: emmiter.emit,
};

export const channelTypes = {
  default: jest.fn(() => ({
    ...channelsDefaultFunctions,
    consume: jest.fn(),
  })),
  confirmation: jest.fn(() => (channelsDefaultFunctions)),
};
