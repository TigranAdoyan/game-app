import './styles/index.scss';
import Logic from './plugins/Logic';
import Graphics from './plugins/Graphics';
import Ui from './plugins/Ui';
import EventManager from './plugins/EventManager';
import Socket from './plugins/Socket';

class Game {
   ready = false;
   constructor() {}

   setupGame(props) {
      if (!this.ready) this.ready = true;
      else return;

      this.jquery = props.jquery;
      this.gameId = props.gameId;
      this.authToken = props.authToken;

      this.plugins = {
         Logic: new Logic(this),
         EventManager: new EventManager(this),
         Graphics: new Graphics(this),
         Ui: new Ui(this),
         Socket: new Socket(this, {
            authToken: this.authToken,
            gameId: this.gameId
         })
      };

      this.plugins.Graphics.setupRenderer({
         jquery: this.jquery
      });
      this.plugins.Socket.join();
   }

   start() {
     this.plugins.Ui.startRendering();
     this.plugins.Graphics.startRendering();
     this.plugins.EventManager._addMouseListener();
   }
}

export default Game;
