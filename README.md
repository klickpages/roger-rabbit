# Roger Rabbit

[![Travis](https://img.shields.io/travis/klickpages/roger-rabbit.svg?style=flat-square)](https://travis-ci.org/klickpages/roger-rabbit/builds)
[![Codecov](https://img.shields.io/codecov/c/github/klickpages/roger-rabbit.svg?style=flat-square)](https://codecov.io/gh/klickpages/roger-rabbit/)
[![npm](https://img.shields.io/npm/v/@klicksite/roger-rabbit.svg?style=flat-square)](https://www.npmjs.com/package/@klicksite/roger-rabbit)
[![npm](https://img.shields.io/npm/dt/@klicksite/roger-rabbit.svg?style=flat-square)](https://www.npmjs.com/package/@klicksite/roger-rabbit)

Roger Rabbit is a module that makes the process of consuming and publishing messages in message brokers easier. It is a wrapper for [amqplib](https://www.squaremobius.net/amqp.node/).

## Install

```shell
npm install @klicksite/roger-rabbit --save
```

## Documentation

### Broker

Broker expect to receives a rabbitMQ connection string and [broker options](#broker-options). Example:

```javascript
// broker.js
const Broker = require('roger-rabbit');

const broker = new Broker('amqp://guest:guest@localhost:5672');

module.exports = broker;
```

### broker.init

Use `broker.init` to initialize broker, creating connections and channels based on [broker options](#broker-options). Example:

```javascript
// main.js
const broker = require('./broker');

(async() => {
  await broker.init();
})();
```

### broker.assertExchanges

Use `broker.assertExchanges` to create or check exchanges. It expects to receive an array of exchanges ([exchange options](#exchange-options)). Example:

```javascript
const broker = require('./broker');

const exchanges = [
  { name: 'user_events', type: 'direct' },
  { name: 'repo_events', type: 'topic', options: { durable: true } },
  { name: 'commit_events', type: 'fanout' },
];

(async() => {
  await broker.assertExchanges(exchanges);
})();
```

### broker.consume

`broker.consume` expects to receive an object with [queue](#queue-options) and array of [bindings](#binding-options) and callback. Example:

```javascript
const broker = require('./broker');

const queue = {
  name: 'queue.name',
  options: {
    durable: true,
  },
};

const bindings = [
  { exchange: 'user_events', routingKey: 'user_events.routingKey' },
  { exchange: 'repo_events', routingKey: 'repo_events.routingKey' },
];

(async() => {
  await broker.consume({ queue, bindings }, (message, /* fields */) => {
    // do something
    // throw an error to reject message
  });
})();
```

### broker.publish

`broker.publish` expects to receive exchange, routing key, message and [publish options](https://www.squaremobius.net/amqp.node/channel_api.html#channel_publish). Example:

```javascript
const options = { persistent: true };

broker.publish({
    exchange: 'user_events',
    routingKey: 'user_events.routingKey',
    message: { message: 'message' },
    options,
  })
```

### broker.channels

Use `broker.channels` to get channels. Examples:

```javascript
const broker = require('./broker');
let context;
let channel;

//consumer
context = 'consumer';
channel = broker.channels[context].default;

//publisher
context = 'publisher';
channel = broker.channels[context].default; // or broker.channels[context].confirmation;
```

### Broker options

| Option                  | Description                                 | Required  | Default |
| ------------------------|---------------------------------------------|-----------|---------|
| channelMax              | number max of channels (max 3)              | no        | 3       |
| publisher               | publisher object                            | no        | _       |
| publisher.default       | create publish channel without confirmation | no        | true    |
| publisher.confirmation  | create publish channel with confirmation    | no        | false   |
| consumer                | consumer object                             | no        | _       |
| consumer.default        | create consume channel                      | no        | true    |
| prefetch                | channel prefetch count                      | no        | 1       |

### Exchange options

| Option  | Description                                                                                                     | Default                 |
| --------|-----------------------------------------------------------------------------------------------------------------|-------------------------|
| type    | direct, topic, fanout                                                                                           | empty string (deafault) |
| name    | exchange name                                                                                                   | null                    |
| options | options used in [assertExchange](http://www.squaremobius.net/amqp.node/channel_api.html#channel_assertExchange) | null                    |

### Queue options

| Option  | Description                                                                                               | Default |
| --------|-----------------------------------------------------------------------------------------------------------|---------|
| name    | queue name                                                                                                | null    |
| options | options used in [assertQueue](http://www.squaremobius.net/amqp.node/channel_api.html#channel_assertQueue) | null    |

### Binding options

| Option     | Description      | Default |
| -----------|------------------|---------|
| exchange   | exchange name    | null    |
| routingKey | routing key name | null    |
