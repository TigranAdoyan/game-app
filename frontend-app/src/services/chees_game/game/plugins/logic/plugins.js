import {figures, players, playersDict} from '../../constants';
import { getFigureInfo } from '../../helpers';

class Validator {
    constructor(logic) {
        this.logic = logic;
    }

    getFigureAccessibleCells(key) {
        if (playersDict[key[3]] !== this.logic.state.myColor) return null;
        return this._getFigureMoveVariants(key);
    }

    _getFigureMoveVariants(key) {
        const {col, raw, figure, player} = getFigureInfo(key);
        return this[`_get_${figure}_moveVariants`](col, raw, player);
    }

    _get_pawn_moveVariants(col, raw, player) {
        const mvs = [];
        if (player === players.white) {
            const nC = {
                col,
                raw: raw + 1
            };
            if (this._isCellEmpty(nC.col, nC.raw)) {
                mvs.push(nC);
                if (+nC.raw === 3) {
                    const nC1 = {
                        col,
                        raw: nC.raw + 1
                    };
                    if (this._isCellEmpty(nC1)) mvs.push(nC1);
                }
            }
        }
        else if (player === players.black) {
            const nC = {
                col,
                raw: raw - 1
            };
            if (this._isCellEmpty(nC.col, nC.raw)) {
                mvs.push(nC);
                if (+nC.raw === 6) {
                    const nC1 = {
                        col,
                        raw: nC.raw - 1
                    };
                    if (this._isCellEmpty(nC1)) mvs.push(nC1);
                }
            }
        }
        return mvs;
    }

    _isCellEmpty(col, raw) {
        return !this.logic.state.figures.find(cell => cell.substring(0, 2) === [col, raw].join());
    }
}


export {
    Validator
}