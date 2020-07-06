const assertChannel = require('./assertChannel');
const connection = require('./modules/connection');

jest.mock('./modules/connection', () => ({
  connect: jest.fn().mockResolvedValue({}),
}));

describe('assertChannel', () => {
  const options = {};
  const context = 'consumer';
  let channel;

  beforeAll(async () => {
    channel = await assertChannel(options)(context);
  });

  test('should call connection.connect with right params', () => {
    expect(connection.connect).toHaveBeenCalledWith({ ...options, context });
  });

  test('should returns channel', () => {
    expect(channel).toEqual({});
  });
});
