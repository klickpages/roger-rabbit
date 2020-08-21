import amqp, { Connection as AmqpConnection } from 'amqplib';
import debuggerLogger from '../utils/debugger_logger';
import { ConnectionError } from '../errors';

export default class Connection {
  private host: string;

  private channelMaxConnections: number;

  private CONTEXT_LOG: string

  constructor(host: string, channelMaxConnections: number = 4) {
    this.host = host;
    this.channelMaxConnections = channelMaxConnections;
    this.CONTEXT_LOG = this.constructor.name.toLocaleLowerCase();
  }

  public async create(context: string = 'default'): Promise<AmqpConnection> {
    try {
      const connection = await amqp.connect(`${this.host}?channelMax=${this.channelMaxConnections}`);
      debuggerLogger({ context: this.CONTEXT_LOG, message: `Connection ${context} created.` });

      return connection;
    } catch (error) {
      throw new ConnectionError({ logMessage: `Error in create ${context} connection.`, error });
    }
  }
}
