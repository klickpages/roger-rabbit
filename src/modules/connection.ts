import amqp, { Connection as AmqpConnection } from 'amqplib';
import debuggerLogger from '../utils/debugger_logger';
import { ConnectionError } from '../errors';

const CONTEXT_LOG = 'connection';

export default class Connection {
  private host: string;

  private channelMaxConnections: number;

  constructor(host: string, channelMaxConnections: number = 4) {
    this.host = host;
    this.channelMaxConnections = channelMaxConnections;
  }

  public async create(context: string = 'default'): Promise<AmqpConnection> {
    try {
      const connection = await amqp.connect(`${this.host}?channelMax=${this.channelMaxConnections}`);
      debuggerLogger({ context: CONTEXT_LOG, message: `Connection ${context} created.` });

      return connection;
    } catch (error) {
      throw new ConnectionError({ logMessage: `Error in create ${context} connection.`, error });
    }
  }
}
