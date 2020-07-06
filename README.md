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

## Example

```javascript
// broker.js
const Broker = require('roger-rabbit');

const broker = Broker({
  host: 'amqp://guest:guest@localhost:5672',
});

module.exports = broker;
```

```javascript
// consumer.js
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

broker.consume({ queue, bindings }, (message) => {
  // do something
  // return a promise or
  // throw an error to reject message
});
```

```javascript
// publisher.js
const broker = require('./broker');

broker
  .publish({
    exchange: 'user_events',
    routingKey: 'user_events.routingKey',
    message: { message: 'hello world' },
  })
  .then(console.log)
  .catch(console.error);
```

## Documentation

### broker.assertExchanges

Use `broker.assertExchanges` to create or check exchanges. It expects to receive an array of exchanges ([exchange options](#exchange-options)). Example: 

```javascript
const broker = require('./broker');

const exchanges = [
  { name: 'user_events', type: 'direct' },
  { name: 'repo_events', type: 'topic', options: { durable: true } },
  { name: 'commit_events', type: 'fanout' },
];

broker.assertExchanges(exchanges);
```

### broker.assertChannel

Use `broker.assertChannel` to create or check channels. It expects to receive a context. Example:

```javascript
const broker = require('./broker');

const context = 'consumer';
const channel = await broker.assertChannel(context);
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

broker.consume({ queue, bindings }, (message) => {
  // do something
  // throw an error to reject message
});
```

### broker.publish

`broker.publish` expects to receive exchange, routing key, message and [publish options](https://www.squaremobius.net/amqp.node/channel_api.html#channel_publish). Example:

```javascript
const options = { persistent: true };

broker
  .publish({
    exchange: 'user_events',
    routingKey: 'user_events.routingKey',
    message: { message: 'message' },
    options,
  })
  .then(message => /* handle success */)
  .catch(error => /* handle error */);
```

### Broker options

| Option     | Description                           | Required  | Default |
| -----------|---------------------------------------|-----------|---------|
| host       | message broker connection url         | yes       | null    |
| logger     | logger object                         | no        | console |
| disableLog | disable log (all levels)              | no        | false   |

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

