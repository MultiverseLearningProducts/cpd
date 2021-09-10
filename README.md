# Multiverse CPD

![the network graph on the main screen](https://user-images.githubusercontent.com/4499581/132812521-34195981-a135-4f47-9a73-96ff4de3e297.png)

This is a Meteor app so get it going with:

```
npm start
```

You'll need secrets (ask the team).

## Data for Aircury

![data model](https://user-images.githubusercontent.com/4499581/130585823-441c49aa-bb4d-4ea5-bca0-95bfaa9b3440.png)

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
You'll get the data dump ready for ingesting into a SQL db. More details in this repo [cpd-sample-client](https://github.com/MultiverseLearningProducts/cpd-sample-client)
