import MessageHelper from './message_helper';

jest.mock('../utils/debugger_logger');

describe('jsonToBuffer', () => {
  describe('when call with right params', () => {
    let result: Buffer;

    beforeAll(() => {
      result = MessageHelper.jsonToBuffer({ message: true });
    });

    it('should creates a buffer from json', () => {
      expect(result).toEqual(Buffer.from(JSON.stringify({ message: true })));
    });
  });
  describe('when call with invalid params', () => {
    let functionError: Function;

    beforeAll(() => {
      functionError = () => MessageHelper.jsonToBuffer(undefined);
    });

    it('should throw Error', () => {
      expect(functionError).toThrowError();
    });
  });
});

describe('bufferToJson', () => {
  describe('When call with right params', () => {
    let result: string;

    beforeAll(() => {
      const message = Buffer.from(JSON.stringify({ message: true }));
      result = MessageHelper.bufferToJson(message);
    });

    it('should parse buffer to json', () => {
      expect(result).toEqual({ message: true });
    });
  });

  describe('When call with invalid params', () => {
    let functionError: Function;

    beforeAll(() => {
      const buffer = Buffer.from('error');
      functionError = () => MessageHelper.bufferToJson(buffer);
    });

    it('should throw Error', () => {
      expect(functionError).toThrowError();
    });
  });
});
