import * as pixijs from "pixi.js";
import * as  tweedlejs from 'tweedle.js';
import { OutlineFilter } from '@pixi/filter-outline';
import {events, colValDictRev, colValDict} from '../../constants';
import {getFigureInfo, getCellInfo} from '../../helpers';
import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";

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

pixijs.Sprite.prototype.meta = {};

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
        this.graphics = {
            selectedFAA: {}
        };
        this._setConstants();
        this._loadAssets();
        this.game.eventEmitter.on(events.check_figure, this._onEventCheckFigure.bind(this));
        this.game.eventEmitter.on(events.move_figure, this._onEventMoveFigure.bind(this));
        this.game.app.view.addEventListener("click", this._onClickBoard.bind(this));
        this.game.app.ticker.start();
        // 'K_diamond'
        // ['6_club'].forEach((card, index) => {
        //     const imgb = new Image(90, 130);
        //     imgb.crossOrigin = "anonymous";
        //     imgb.src = `http://localhost:3335/static/durak_images/cards/${card}.svg`;
        //     let spirite = null;
        //
        //     let i = true;
        //     let c = false;
        //     let d = false;
        //     const g = new tweedlejs.Group();
        //     const img = new Image(90, 130);
        //     img.crossOrigin = "anonymous";
        //     img.src = `http://localhost:3335/static/durak_images/cards/backside.png`;
        //     img.onload = () => {
        //         spirite = new pixijs.Sprite(pixijs.Texture.from(img));
        //         spirite.x = 300 + index*25;
        //         spirite.y = 100;
        //         spirite.anchor.set(.5);
        //         spirite.rotation = !index ? -.1 : .1;
        //         this.game.app.stage.addChild(spirite);
        //         const t = new tweedlejs.Tween(spirite)
        //             .to({x: 300 + index*25, y: 400}, 300)
        //             .start()
        //             .onComplete(() => c = true);
        //         g.add(t);
        //         spirite.filters = [new OutlineFilter(2, 0x99ff99)]
        //     };
        //
        //     this.game.app.ticker.add(() => {
        //         if (!c) g.update();
        //
        //         if (c && !d) {
        //             g.pause();
        //             if (i) {
        //                 spirite.width = spirite.width - 10 < 0 ? 0 : spirite.width - 10;
        //                 if (spirite.width === 0) {
        //                     i = false;
        //                     spirite.texture = pixijs.Texture.from(imgb);
        //                 }
        //             } else {
        //                 spirite.width = spirite.width + 10 > 90 ? 90 : spirite.width + 10;
        //                 if (spirite.width === 90) d = true;
        //             }
        //         }
        //     });
        //     this.game.app.ticker.start();
        // })
    }

    startRendering() {
        const boardSpirit = new pixijs.Sprite(this.textures.scene.board);
        boardSpirit.x = 0;
        boardSpirit.y = 0;
        this.game.app.stage.addChild(boardSpirit);
        this.spirites.scene.board = boardSpirit;

        this.game.state.figures.forEach(key => {
            const {colV, rawP, figure, player} = getFigureInfo(key);
            const spirit = new pixijs.Sprite(this.textures.figure[`${player.substring(0, 1)}_${figure}`]);
            spirit.interactive = true;
            spirit['name'] = key;
            spirit.on('click', () => this.game.plugins.logic.onClickFigure(spirit));
            spirit.anchor.set(.5);
            const {x, y} = this._getCellCenterCoordinates(colV, rawP);
            spirit.x = x;
            spirit.y = y;
            this.game.app.stage.addChild(spirit);
            this.spirites.figure[key] = spirit;
        })
    }

    _onEventCheckFigure(acs) {
        const oldKeys = Object.keys(this.graphics.selectedFAA);
        if (oldKeys.length) {
            oldKeys.forEach(key => {
                this.graphics.selectedFAA[key].destroy(true);
                delete this.graphics.selectedFAA[key];
            })
        }
        if (!Array.isArray(acs)) return;
        acs.forEach(c => {
            const key = `${c.col}${c.raw}`;
            const {colV, rawP} = getCellInfo(key);
            const s = new pixijs.Graphics();
            s.beginFill(1683486, .8);
            s.drawCircle(10, 10, 10);
            s.endFill();
            const { x, y } = this._getCellCenterCoordinates(colV, rawP);
            s.x  = x - 10;
            s.y  = y - 10;
            this.graphics.selectedFAA[key] = s;
            this.game.app.stage.addChild(s);
        });
    }

    _onEventMoveFigure(props) {
        const {from ,to} = props;
        const entries = Object.entries(this.spirites.figure);
        for (const [key, spirit] of entries) {
            if (key.substring(0, 2) === `${from.col}${from.raw}`) {
                const { colV, rawP } = getFigureInfo(`${to.col}${to.raw}${key.substring(2, 4)}`);
                const {x, y} = this._getCellCenterCoordinates(colV, rawP);
                const group = new tweedlejs.Group();
                const tween = new tweedlejs.Tween(spirit)
                    .to({ x, y }, 100)
                    .onComplete(() => {
                        group.remove(tween);
                        finishedMove();
                        tween.stop();
                    })
                    .start();
                group.add(tween);
                this.game.eventEmitter.emit(events.check_figure, null);
                this.game.app.ticker.add(() => {
                    group.update()
                });
                this.game.app.ticker.start();
                const finishedMove = () => {
                    for (const [key, spirit] of entries) {
                        if (key.substring(0, 2) === `${to.col}${to.raw}`) {
                            spirit.destroy(true);
                            delete this.spirites.figure[key];
                            break;
                        }
                    }
                    const k = `${to.col}${to.raw}${key.substring(2, 4)}`;
                    spirit['name'] = k;
                    this.spirites.figure[k] = spirit;
                    delete this.spirites.figure[key];
                };
                break;
            }
        }
    }

    _onClickBoard(e) {
        if (!Object.keys(this.graphics.selectedFAA).length) return;
        const { offsetX: x, offsetY: y } = e;
        const sCell = this._getCellByCoordinate(x, y);
        if (sCell && this.graphics.selectedFAA[`${sCell.col}${sCell.raw}`]) this.game.plugins.logic.onClickCell(sCell)
    }

    _setConstants() {
        this.constants.border = this.game.app.renderer.width / 100 * 3.65;
        this.constants.cellSize = (this.game.app.renderer.width - 2 * this.constants.border) / 8;
        this.constants.cellPadding = this.constants.cellSize * .1;
        this.constants.figureSize = this.constants.cellSize - this.constants.cellPadding * 2;
    }

    _getCellCenterCoordinates(col, raw) {
        return {
            x: this.constants.border + (this.constants.cellSize / 2) + (this.constants.cellSize * --col),
            y: this.constants.border + (this.constants.cellSize / 2) + (this.constants.cellSize * --raw),
        }
    }

    _getCellByCoordinate(x, y) {
        const result = {
            raw: Math.floor(9 - ((y - this.constants.border) / this.constants.cellSize)),
            col: colValDictRev[Math.floor((x - this.constants.border) / this.constants.cellSize + 1)]
        };
        const isOutOfBoard = [result.raw, result.col].find(v => v <= 1 || v >= 9);
        if (isOutOfBoard) return null;
        return result;
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
}

export default Graphics