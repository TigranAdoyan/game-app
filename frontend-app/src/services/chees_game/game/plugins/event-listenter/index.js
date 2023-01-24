class EventListener {
    constructor(game) {
        this.game = game;
    }

    listen() {
        this.game.app.view.addEventListener("mousedown", (e) => {
            const cell = this.game.plugins.graphics.isClickInsideCell(e.offsetX, e.offsetY);
            if (!(this.game.state.turnPlayer === this.game.state.myColor) || !cell ||
                !this.game.state.figures[this.game.state.myColor][cell.cell]) return;
            this.game.plugins.logic.selectFigure(cell.cell)
        })
    }
}

export default EventListener;