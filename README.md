# @jumpfox/broker
![Build](https://github.com/jumpfoxltd/broker/workflows/Build/badge.svg?branch=master)

Message Broker for javascript applications

request or import Broker in your code and call 

- ```subscribe``` to create a subscription to a topic with a callback to handle the incoming messages
- ```publish``` to publish a message to other listeners
- ```unsubscribe``` to stop listening to a topic

## Usage
```javascript
import {Broker} from '@jumpfoxltd/broker';
```
or 
```javascript
const {Broker} = require('@jumpfoxltd/broker');
```
### Subscribe
```javascript
const topic = 'test-topic';
cost cb = (payload)=>{ 
// the payload can be anything that you want to consume
}
Broker.subscribe(topic,cb);
```

### Publish
In order publish a topic , you have to subscribe a topic first and then you can publish anything you want to it
```javascript
const topic = 'test-topic';
Broker.publish(topic,{data:'test'});
```

### Unsubscribe
```javascript
const topic = 'test-topic';
cost cb = (payload)=>{ 
// the payload can be anything that you want to consume
}
Broker.unsubscribe(topic,cb);
```
