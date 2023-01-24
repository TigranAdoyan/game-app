import * as pixijs from "pixi.js";
import Graphics from "./plugins/graphics";
import Logic from "./plugins/logic";
import EventListener from "./plugins/event-listenter";

class Game {
    constructor() {
        const containerElement = document.getElementById("chess_container");
        const app = new pixijs.Application({
            width: containerElement.clientWidth,
            height: containerElement.clientHeight,
            transparent: true,
            antialias: true,
            backgroundColor: '#B68873'
        });

        setInterval(() => {
            app.renderer.resize(containerElement.clientWidth, containerElement.clientHeight);
        }, 1000);

        app.renderer.view.style.position = 'absolute';
        containerElement.appendChild(app.view);
        this.app = app;

        this.plugins = {
            graphics: new Graphics(this),
            logic: new Logic(this),
            eventListener: new EventListener(this),
        };

        this.start();
    }

    start() {
        this.plugins.logic.newGame();
        this.plugins.graphics.startRendering();
        this.plugins.logic.startGame();
        this.plugins.eventListener.listen();
    }
}

export default Game;