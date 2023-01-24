import * as pixijs from "pixi.js";
import { posDictRev, posDict } from '../../constants';

const assetsPaths = {
    scene: {
        'board': 'http://localhost:3335/static/chess_images/board.jpg',
    },
    figure: {
        'b_bishop': 'http://localhost:3335/static/chess_images/figures/b_bishop.svg',
        'b_king': 'http://localhost:3335/static/chess_images/figures/b_king.svg',
        'b_knight': 'http://localhost:3335/static/chess_images/figures/b_knight.svg',
        'b_pawn': 'http://localhost:3335/static/chess_images/figures/b_pawn.svg',
        'b_queen': 'http://localhost:3335/static/chess_images/figures/b_queen.svg',
        'b_rook': 'http://localhost:3335/static/chess_images/figures/b_rook.svg',
        'w_bishop': 'http://localhost:3335/static/chess_images/figures/w_bishop.svg',
        'w_king': 'http://localhost:3335/static/chess_images/figures/w_king.svg',
        'w_knight': 'http://localhost:3335/static/chess_images/figures/w_knight.svg',
        'w_pawn': 'http://localhost:3335/static/chess_images/figures/w_pawn.svg',
        'w_queen': 'http://localhost:3335/static/chess_images/figures/w_queen.svg',
        'w_rook': 'http://localhost:3335/static/chess_images/figures/w_rook.svg',
    },
};


class Graphics {
    constructor(game) {
        this.game = game;
        this.constants = {};
        this.textures = {
            scene: {},
            figure: {},
        };
        this.spirites = {
            scene: {},
            figure: {},
        };
        this.positionsToListen = [];
        this._setConstants();
        this._loadAssets();
        this._genCellsCoordinates();
    }

    startRendering() {
        const boardSpirit = new pixijs.Sprite(this.textures.scene.board);
        boardSpirit.x = 0;
        boardSpirit.y = 0;
        this.game.app.stage.addChild(boardSpirit);
        this.spirites.scene.board = boardSpirit;

        for (const [player, figures] of Object.entries(this.game.state.figures)) {
            const letter = player.substring(0, 1);
            for (const [position, figure] of Object.entries(figures)) {
                const [col, raw] = position.split('');
                const spirit = new pixijs.Sprite(this.textures.figure[`${letter}_${figure}`]);
                spirit.x = this.constants.border + this.constants.cellPadding + (this.constants.cellSize * posDict.col[col]);
                spirit.y = this.constants.border + this.constants.cellPadding + (this.constants.cellSize * posDict.raw[raw]);
                this.game.app.stage.addChild(spirit);
                this.spirites.figure[`${letter}_${figure}`] = spirit;
            }
        }
    }

    updateRendering() {
        for (const [player, figures] of this.game.state) {
            const letter = player.substring(0, 1);
            for (const [figure, position] of figures) {
                const [col, raw] = position.split('');
                const name = `${letter}_${figure}`;
                this.spirites.figure[name].x = this.constants.border + this.constants.cellPadding + (this.constants.cellSize * posDict.col[col]);
                this.spirites.figure[name].y = this.constants.border + this.constants.cellPadding + (this.constants.cellSize * posDict.raw[raw]);
            }
        }
    }

    isClickInsideCell(x, y) {
        return this.positionsToListen.find(pos => {
            return (pos.x < x && x < (pos.x + this.constants.figureSize)) &&
                (pos.y < y && y < (pos.y + this.constants.figureSize))
        })
    }

    _setConstants() {
        this.constants.border = this.game.app.renderer.width / 100 * 3.65;
        this.constants.cellSize = (this.game.app.renderer.width - 2 * this.constants.border) / 8;
        this.constants.cellPadding = this.constants.cellSize * .1;
        this.constants.figureSize = this.constants.cellSize - this.constants.cellPadding * 2;
    }

    _loadAssets() {
        for (const [type, data] of Object.entries(assetsPaths)) {
            for (const [key, path] of Object.entries(data)) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = path;
                if (type === "scene") {
                    img.width = this.game.app.renderer.width;
                    img.height = this.game.app.renderer.height;
                } else if (type === "figure") {
                    img.width = this.constants.figureSize;
                    img.height = this.constants.figureSize;
                }
                this.textures[type][key] = pixijs.Texture.from(img);
            }
        }
    }

    _genCellsCoordinates() {
        for (const [col, colSymbol] of Object.entries(posDictRev.col)) {
            for (const [raw, rawSymbol] of Object.entries(posDictRev.raw)) {
                this.positionsToListen.push({
                    x: this.constants.border + this.constants.cellPadding + (this.constants.cellSize * col),
                    y: this.constants.border + this.constants.cellPadding + (this.constants.cellSize * raw),
                    cell: `${colSymbol}${rawSymbol}`
                });
            }
        }
    }
}

export default Graphics