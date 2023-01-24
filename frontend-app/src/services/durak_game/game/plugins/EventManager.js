import {isMyTurn} from '../functions';

export default class EventManager {
    constructor(game) {
        this.game = game;
    }

    _addMouseListener() {
        this.game.plugins.Graphics.$game_container.addEventListener('mousedown', (event) => {
            const rect = this.game.plugins.Graphics.canvas.getBoundingClientRect();
            if (isMyTurn(this.game.state)) {
                this.game.plugins.Logic.onMouseDown({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                })
            }
        });
    }
}
