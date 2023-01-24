require('./helpers/globalConfiguration');
const nats = require('nats');
const { natsTopics } = require('./helpers/constants');
const Dashboard = require('./nats-handlers/dashboard');
const Invitation = require('./nats-handlers/invitation');
const Game = require('./nats-handlers/game');


(async function () {
   const sc = nats.StringCodec();
   const client = await nats.connect({
      servers: "localhost"
   }, {
      queue: "game_service"
   });
   client.topics = natsTopics;
   client.sub = async function (topic, callback) {
      const syncSubscription = this.subscribe(topic);

      (async () => {
         for await (const m of syncSubscription) {
            callback(JSON.parse(sc.decode(m.data)), m.subject);
         }
      })().then(console.log);
   };
   client.pub = async function (topic, data = {}) {
      await this.publish(topic, sc.encode(JSON.stringify(data)));
   };

   const handlers = {
      [client.topics.sub.dashboard]: new Dashboard(client),
      [client.topics.sub.invitation]: new Invitation(client),
      [client.topics.sub.game]: new Game(client)
   };

   for (const [topic, handler] of Object.entries(handlers)) {
       await client.sub(topic, (data) => {
          console.log(`>> from ${data.userId} >> method ${data.method}`);
          if (handler.handler_method) handler[handler.handler_method](data)
          else if (handler.methodDict[data.method]) handler[handler.methodDict[data.method]](data);
       })
   }

   logger.info('Nats Client initialized successfully !');
})();
