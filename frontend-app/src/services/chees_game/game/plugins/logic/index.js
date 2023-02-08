import {newGameState, gameStatues, events, colValDict} from '../../constants';
import { Validator } from './plugins';

class Logic {
    constructor(game) {
        this.game = game;
        this.plugins = {
            validator: new Validator(this),
        };
        this.state = newGameState;
    }

    newGame() {
        this.state = newGameState;
    }

    startGame() {
        this.game.state.status = gameStatues.playing;
    }

    onClickCell(c) {
        if (!this.state.selectedFigure) return;
        const aC = this.plugins.validator.getFigureAccessibleCells(this.state.selectedFigure);
        if (aC.find(c1 => c1.raw === c.raw && c1.col === c.col)) {
            this.game.state.figures = this.game.state.figures.map(k => {
                if (k === this.state.selectedFigure) {
                   return `${c.col}${c.raw}${k.substring(2, 4)}`
                }
                return k;
            });
            this.game.eventEmitter.emit(events.move_figure, {
                from: {
                    col: this.state.selectedFigure[0],
                    raw: this.state.selectedFigure[1],
                },
                to: c
            });
            this.state.selectedFigure = null;
        }
    }

    onClickFigure(f) {
        const key = f['name'];
        if (this.state.selectedFigure && this.state.selectedFigure === key) {
            this.state.selectedFigure = null;
            this.game.eventEmitter.emit(events.check_figure, null);
            return;
        }
        const aC = this.plugins.validator.getFigureAccessibleCells(key);
        if (aC.length) {
            this.state.selectedFigure = key;
            this.game.eventEmitter.emit(events.check_figure, aC);
        }
    }
}

export default Logic;