import { defaultsDeep } from 'lodash';
import Connection from './modules/connection';
import Channel from './modules/channel';
import Publisher from './modules/publisher';
import Consumer from './modules/consumer';
import ChannelError from './errors/ChannelError';
import Exchange from './modules/exchange';
import {
  connections, channels, brokerOptions, contextArray, contextString, publisherInstances,
} from './interfaces/IBroker';
import { exchangeObject } from './interfaces/IExchange';
import { consumerOptions } from './interfaces/IConsumer';
import { publisherOptions } from './interfaces/IPublisher';
import { channelStringTypes } from './interfaces/IChannel';

const defaultOptions = {
  channelMax: 3,
  publisher: {
    default: true,
    confirmation: false,
  },
  consumer: {
    default: true,
  },
};

class Broker {
  private connections: connections

  private brokerChannels: channels

  private options: brokerOptions

  private publisherInstances: publisherInstances;

  constructor(private host: string, options: brokerOptions = defaultOptions) {
    this.options = defaultsDeep({}, options, defaultOptions);
    this.options.consumer.confirmation = false;
    this.publisherInstances = {};
  }

  get channels() {
    return this.brokerChannels;
  }

  public async init(): Promise<Broker> {
    const contexts: contextArray = ['publisher', 'consumer'];
    await Promise.all(contexts.map(this.createConnection.bind(this)));
    await Promise.all(contexts.map(this.createChannel.bind(this)));

    const channelTypes: Array<channelStringTypes> = ['default', 'confirmation'];

    channelTypes.forEach((type) => {
      if (this.options.publisher[type] === true) {
        this.publisherInstances[type] = new Publisher(this.brokerChannels.publisher[type]);
      }
    });

    this.init = function init() { return Promise.resolve(this); };

    return this;
  }

  public assertExchanges(exchanges: Array<exchangeObject>) {
    const { publisher } = this.channels;

    const channel = publisher
      ? publisher.default || publisher.confirmation
      : null;

    if (!channel) {
      throw new ChannelError({ logMessage: 'Publisher channels was not created.' });
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
      this.connections = defaultsDeep({}, connection, this.connections);
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

    if (contextObjectConfig[channelType] && this.connections[context]) {
      const channel = {
        [context]: {
          [channelType]: await new Channel(this.connections[context]).create(channelType, context),
        },
      };
      this.brokerChannels = defaultsDeep({}, channel, this.brokerChannels);
    }
  }

  private genericPublish(options: publisherOptions, type: channelStringTypes) {
    if (this.options.publisher[type] !== true) {
      throw new ChannelError({ logMessage: `Publish ${type} channel was not created.` });
    }

    return this.publisherInstances[type].publish(options);
  }
}
export = Broker;
