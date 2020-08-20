export default class MessageHelper {
  static jsonToBuffer = jest.fn((json) => json);

  static bufferToJson = jest.fn();
}
