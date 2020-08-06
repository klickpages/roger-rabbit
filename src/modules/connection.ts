import amqp from 'amqplib';
import helpers from './helpers';

const connections = {
  publisher: null,
  consumer: null
};

class Connection {
  private host;

  constructor(host : string) {
    this.host = host;
  }

  static getConnection(host : string, context : string) : Connection {
    if(!connections[context]) {
      connections[context] = new Connection(host).create();
    }

    return connections[context];
  }

  private async create() : Promise<amqp.Connection> {
    try {
      const connection = await amqp.connect(this.host);
      return connection;
    } catch(error) {
      helpers.log('error', 'connection', error.message);
      throw error;
    }
  }
}

export default (host : string, context : string) => Connection.getConnection(host, context);
