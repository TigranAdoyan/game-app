import * as pixijs from 'pixi.js';
import * as tweedlejs from 'tweedle.js';
import {newGameState, gameStatues, posDict} from '../../constants';
import { Validator } from './plugins';

class Logic {
    constructor(game) {
        this.game = game;
        this.plugins = {
            validator: new Validator(game),
        }
    }

    newGame() {
        this.game.state = newGameState
    }

    startGame() {
        this.game.state.status = gameStatues.playing;
    }

    selectFigure(cell) {
        this.plugins.validator.isFigureChecked(cell)

        // pixijs.Ticker.shared.add(() => {
        //     tweedlejs.Group.shared.update()
        // }, this);
        //
        // const gr  = new pixijs.Graphics();
        // gr.beginFill(0x517D0F);
        // gr.drawCircle(30, 30, 30);
        // gr.endFill();
        // this.game.app.stage.addChild(gr);
        //
        // const img = new Image(58, 82);
        // img.crossOrigin = "anonymous";
        // img.src = `http://localhost:3335/static/durak_images/cards/6_club.svg`;
        // const spirit = new pixijs.Sprite(pixijs.Texture.from(img));
        // spirit.x = 10;
        // spirit.y = 10;
        // this.game.app.stage.addChild(spirit);
        // new tweedlejs.Tween(spirit)
        //     .to({x: 200, y: 200}, 400)
        //     .start();
    }
}

export default Logic;