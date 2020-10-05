import { EventEmitter } from 'events';

const emmiter = new EventEmitter();

export const channelsDefaultFunctions = {
  assertExchanges: jest.fn(),
  assertQueue: jest.fn(),
  bindQueue: jest.fn(),
  publish: jest.fn(),
};

export const create = jest.fn().mockResolvedValue({
  createChannel: () => ({
    ...channelsDefaultFunctions,
    consume: jest.fn(),
  }),
  createConfirmChannel: () => (channelsDefaultFunctions),
  close: jest.fn(),
  on: emmiter.on,
  emit: emmiter.emit,
});
