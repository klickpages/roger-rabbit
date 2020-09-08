import { defaultsDeep } from 'lodash';
import { Connection as AmqpConnection } from 'amqplib';
import Connection from './modules/connection';
import Channel from './modules/channel';
import Publisher from './modules/publisher';
import Consumer from './modules/consumer';
import ChannelError from './errors/ChannelError';
import Exchange from './modules/exchange';
import {
  connections, channels, brokerOptions, contextArray, contextString,
} from './interfaces/IBroker';
import { exchangeObject } from './interfaces/IExchange';
import { consumerOptions } from './interfaces/IConsumer';
import { publisherOptions } from './interfaces/IPublisher';
import { channelStringTypes } from './interfaces/IChannel';
import debuggerLogger from './utils/debugger_logger';

const defaultOptions = {
  channelMax: 3,
  heartbeat: 30,
  publisher: {
    default: true,
    confirmation: false,
  },
  consumer: {
    default: true,
  },
};

class Broker {
  private brokerConnections: connections

  private brokerChannels: channels

  private options: brokerOptions

  constructor(private host: string, options: brokerOptions = defaultOptions) {
    this.options = defaultsDeep({}, options, defaultOptions);
    this.options.consumer.confirmation = false;
  }

  get connections(): connections {
    return this.brokerConnections;
  }

  get channels(): channels {
    return this.brokerChannels;
  }

  public async init(): Promise<Broker> {
    const contexts: contextArray = ['publisher', 'consumer'];
    await Promise.all(contexts.map(this.createConnection.bind(this)));
    await Promise.all(contexts.map(this.createChannel.bind(this)));
    await this.recoverStatesListener();

    return this;
  }

  public assertExchanges(exchanges: Array<exchangeObject>) {
    const { publisher } = this.channels;

    const channel = publisher
      ? publisher.default || publisher.confirmation
      : null;

    if (!channel) {
      throw new ChannelError({ message: 'Publisher channels was not created.' });
    }

    return new Exchange(channel).assert(exchanges);
  }

  public publish(options: publisherOptions) {
    return this.genericPublish(options, 'default');
  }

  public publishConfirm(options: publisherOptions) {
    return this.genericPublish(options, 'confirmation');
  }

  public consume(options: consumerOptions, action: Function) {
    return new Consumer(this.channels.consumer.default, options).consume(action);
  }

  private async createConnection(context: contextString): Promise<void> {
    const contextObjectConfig = this.options[context];
    if (contextObjectConfig.default || contextObjectConfig.confirmation) {
      const connection = {
        [context]: await new Connection(this.host, this.options.channelMax)
          .create(context),
      };
      this.brokerConnections = defaultsDeep({}, connection, this.brokerConnections);
    }
  }

  private async createChannel(context: contextString): Promise<Array<void>> {
    const channelTypes: Array<channelStringTypes> = ['default', 'confirmation'];
    return Promise.all(channelTypes.map((type) => this.createGenericChannel(context, type)));
  }

  private async createGenericChannel(
    context: contextString, channelType: channelStringTypes,
  ) {
    const contextObjectConfig = this.options[context];

    if (contextObjectConfig[channelType] && this.brokerConnections[context]) {
      const channel = {
        [context]: {
          [channelType]: await new Channel(this.brokerConnections[context])
            .create(channelType, context),
        },
      };
      this.brokerChannels = defaultsDeep({}, channel, this.brokerChannels);
    }
  }

  private genericPublish(options: publisherOptions, type: channelStringTypes) {
    if (this.options.publisher[type] !== true) {
      throw new ChannelError({ message: `Publish ${type} channel was not created.` });
    }

    return new Publisher(this.brokerChannels.publisher[type]).publish(options);
  }

  private async connectionListeners(
    connection: AmqpConnection, context: contextString,
  ): Promise<void> {
    debuggerLogger({ context: 'broker', message: `Creating connection listener for ${context}` });
    connection.on('error', (error) => {
      debuggerLogger({ context: 'broker:error', message: 'Erro on connections.', metadata: error });
    });
    connection.on('close', async () => {
      await this.createConnection.bind(this)(context);
      await this.createChannel.bind(this)(context);
      connection.emit('recreated');
    });
  }

  private async recoverStatesListener() {
    if (this.options.consumer.default === true) {
      await this.connectionListeners(this.connections.consumer, 'consumer');
    }

    if (this.options.publisher.default === true || this.options.publisher.confirmation === true) {
      await this.connectionListeners(this.connections.publisher, 'publisher');
    }
  }
}
export = Broker;
