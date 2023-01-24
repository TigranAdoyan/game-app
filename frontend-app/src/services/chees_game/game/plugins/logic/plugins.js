import { figures, playersColors } from '../../constants';
import {move} from "formik";

class Validator {
    constructor(game) {
       this.game = game;
    }

    isFigureChecked(cell) {
        this._getFigureAccessibleCells(cell);
    }

    _getFigureAccessibleCells(cell) {
        const moveVariants = this._getFigureMoveVariants(cell);
        console.log("moveVariants: ", moveVariants)
    }

    _getFigureMoveVariants(cell) {
        let [col, raw] = cell.split('');
        raw = +raw;
        switch (this.game.state.figures[this.game.state.myColor][cell]) {
            case figures.pawn: {
                  const m = this.game.state.myColor === 'white' ? 1 : -1;
                  const arrToCheck = [`${col}${+raw + m}`];
                  if (m === 1 && raw === 2) {
                      arrToCheck.push(`${col}${raw + m + 1}`)
                  } else if (m === -1 && raw === 6) {
                      arrToCheck.push(`${col}${raw + m - 1}`)
                  }
                console.log("arrToCheck: ", arrToCheck);
                return this._isEmpty(arrToCheck);
            }
            default: {
                return null;
            }
        }
    }

    _isEmpty(cells) {
        for (const cell of cells) {
           if (this.game.state.figures[playersColors.white][cell] || this.game.state.figures[playersColors.black][cell]) {
               return false;
           }
        }
        return true;
    }
}


export {
    Validator
}