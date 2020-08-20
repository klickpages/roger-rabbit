const channelsDefaultFunctions = {
  assertExchanges: jest.fn(),
  assertQueue: jest.fn(),
  bindQueue: jest.fn(),
  publish: jest.fn(),
};

export const channelTypes = {
  default: jest.fn(() => ({
    ...channelsDefaultFunctions,
    consume: jest.fn(),
  })),
  confirmation: jest.fn(() => (channelsDefaultFunctions)),
};
