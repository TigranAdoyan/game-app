import * as pixijs from "pixi.js";
import Graphics from "./plugins/graphics";
import Logic from "./plugins/logic";
import EventEmitter from "./plugins/event_emitter";

class Game {
    constructor() {
        const containerElement = document.getElementById("chess_container");
        const app = new pixijs.Application({
            width: containerElement.clientWidth,
            height: containerElement.clientHeight,
            transparent: true,
            antialias: true,
            backgroundColor: '#592E1D',
        });

        setInterval(() => {
            app.renderer.resize(containerElement.clientWidth, containerElement.clientHeight);
        }, 1000);


        app.view.interactive = true;
        app.renderer.view.style.position = 'absolute';
        containerElement.appendChild(app.view);
        this.app = app;

        this.eventEmitter = new EventEmitter();

        this.plugins = {
            graphics: new Graphics(this),
            logic: new Logic(this),
        };

        this.start();
    }

    get state() {
        return this.plugins.logic.state;
    }

    start() {
        this.plugins.logic.newGame();
        this.plugins.graphics.startRendering();
        this.plugins.logic.startGame();
    }
}

export default Game;