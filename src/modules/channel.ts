import {
  Connection as AmqpConnection,
  Channel as AmqpChannel, ConfirmChannel as AmpqConfirmChannel,
} from 'amqplib';
import debuggerLogger from '../utils/debugger_logger';
import { ChannelError } from '../errors';
import { channelTypes, channelStringTypes, channelContexts } from '../types/channel';

const CONTEXT_LOG = 'channel';

export default class Channel {
  private connection: AmqpConnection

  private channelTypes: channelTypes

  constructor(connection: AmqpConnection) {
    this.connection = connection;
    this.channelTypes = {
      default: () => this.connection.createChannel(),
      confirmation: () => this.connection.createConfirmChannel(),
    };
  }

  public async create(type: channelStringTypes = 'default',
    context: channelContexts): Promise<AmqpChannel | AmpqConfirmChannel> {
    try {
      const channel = await this.channelTypes[type].bind(this)();
      debuggerLogger({ message: `Channel ${context}.${type} created.`, context: CONTEXT_LOG });

      return channel;
    } catch (error) {
      throw new ChannelError({ error, logMessage: `Error in ${context}.${type} create channel.` });
    }
  }
}
