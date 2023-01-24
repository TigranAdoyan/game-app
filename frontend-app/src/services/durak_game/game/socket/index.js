import io from "socket.io-client";

class SocketClient {
   constructor(props) {
      this.socket = io(`http://localhost:3334/game`, {
         auth: {
            token: props.token,
            game_id: props.gameId
         },
         transports: Math.random() < 5 ? ["polling"] : ["polling", "websocket"],
         authConnect: true,
      });

      this.events = {
         client: {
            action: 'client:action'
         },
         server: {
            action: 'server:action'
         }
      };

      this.methods = {
         server: {
            'server:start_game': 'server:start_game',
            'server:attack': 'server:attack',
            'server:join': 'server:join',
            'server:defend': 'server:defend',
            'server:collect': 'server:collect',
            'server:pass': 'server:pass',
            'server:disconnected': 'server:disconnected',
            'server:sync_game_state': 'server:sync_game_state',
         },
         client: {
            'client:join': 'client:join',
            'client:attack': 'client:attack',
            'client:defend': 'client:defend',
            'client:collect': 'client:collect',
            'client:pass': 'client:pass',
            'client:disconnected': 'client:disconnected',
            'client:connected': 'client:connected'
         }
      };

      this.socket.on('connect', () => {
         console.log('game socket connected');
      });
      this.socket.on('connect_error', err => {
         console.error('connect_error', err)
      });
      this.socket.on('connect_failed', err => {
         console.error('connect_failed', err)
      });
      this.socket.on('disconnect', err => {
         console.warn(err)
      });

      this.socket.on(this.events.server.action, (data) => {
         if (Array.isArray(this.listeners[data.method])) {
            this.listeners[data.method].forEach(cb => {
               if (typeof cb === 'function') cb(data.payload);
            })
         }
      });

      this.listeners = {};
   }

   addMethodListener(method, callback) {
      if (!this.methods.server[method]) return;
      if (Array.isArray(this.listeners[method])) this.listeners[method].push(callback);
      else this.listeners[method] = [callback];
   }
}

export default SocketClient;
