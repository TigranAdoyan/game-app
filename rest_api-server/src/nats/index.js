const nats = require('nats');
const {natsTopics, natsMethods} = require('../helpers/constants');

module.exports = async function() {
   const sc = nats.StringCodec();

   const natsClient = await nats.connect({
      servers: "localhost"
   });

   logger.info(`Nats client successfully initialized`);

   natsClient.sub = function (topic, callback) {
      const subscription = this.subscribe(topic);

      (async () => {
         for await (const m of subscription) {
            callback({
               data: JSON.parse(sc.decode(m.data)),
               subject: m.subject
            });
         }
      })();

      return subscription;
   };
   natsClient.pub = async function (topic, data = {}) {
      await this.publish(topic, sc.encode(JSON.stringify(data)));
   };
   natsClient.topics = natsTopics;
   natsClient.methods = natsMethods;

   return natsClient;
}