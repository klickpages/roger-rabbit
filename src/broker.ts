import { defaultsDeep } from 'lodash';
import Connection from './modules/connection';
import Channel from './modules/channel';
import Publisher from './modules/publisher';
import Consumer from './modules/consumer';
import ChannelError from './errors/ChannelError';
import Exchange from './modules/exchange';
import {
  connections, channels, brokerInit, brokerOptions, contextArray, contextString,
} from './interfaces/IBroker';
import { exchangeObject } from './interfaces/IExchange';
import { consumerOptions } from './interfaces/IConsumer';
import { publisherOptions } from './interfaces/IPublisher';
import { channelStringTypes } from './interfaces/IChannel';

const defaultOptions = {
  channelMax: 4,
  contexts: {
    publisher: {
      default: true,
      confirmation: false,
    },
    consumer: {
      default: true,
    },
  },
};

export default class Broker {
  private connections: connections

  private brokerChannels: channels

  private options: brokerOptions

  constructor(private host: string, options: brokerOptions = defaultOptions) {
    this.options = defaultsDeep({}, options, defaultOptions);
    this.options.contexts.consumer.confirmation = false;
  }

  get channels() {
    return this.brokerChannels;
  }

  public async init(): Promise<brokerInit> {
    const contexts: contextArray = ['publisher', 'consumer'];
    await Promise.all(contexts.map(this.createConnection.bind(this)));
    await Promise.all(contexts.map(this.createChannel.bind(this)));

    this.init = null;
    delete this.init;

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
    const contextObjectConfig = this.options.contexts[context];
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
    const contextObjectConfig = this.options.contexts[context];

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
    if (this.options.contexts.publisher[type] !== true) {
      throw new ChannelError({ logMessage: `Publish ${type} channel was not created.` });
    }
    return new Publisher(this.brokerChannels.publisher[type]).publish(options);
  }
}
