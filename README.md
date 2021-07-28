# Multiverse CPD

![the network graph on the main screen](https://user-images.githubusercontent.com/4499581/127388465-a46566f7-b4b8-4aea-bd4a-c2a07aa8daed.png)

This is a Meteor app so get it going with:

```
npm start
```

You'll need secrets.

## Data for Aircury

![data model](https://user-images.githubusercontent.com/4499581/127390296-3965da45-ee5e-4c53-b95b-03fc672e8d55.png)

connect via a 3rd party DDP client like this

```javascript
const SimpleDDP = require('simpleddp')
const WebSocket = require('isomorphic-ws')

const config = {
    endpoint: 'ws://localhost:3000/websocket',
    SocketConstructor: WebSocket,
    reconnectInterval: 5000
}

const DDP = new SimpleDDP(config)

DDP.on('connected', async () => {
    const data = await DDP.call('getObservationsData')
    console.log(data)
    DDP.disconnect().then(process.exit)
})
```
You'll get the data dump ready for ingesting into a SQL db
