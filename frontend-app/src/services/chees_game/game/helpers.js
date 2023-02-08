import {
   playersDict,
   figuresDict,
    colValDict,

} from './constants';

function getFigureInfo(str) {
   const [cL, rL, fL, pL] = str.split('');
   return {
      col: cL,
      raw: Number(rL),
      colV: colValDict[cL],
      rawP: 9 - Number(rL),
      figure: figuresDict[fL],
      player: playersDict[pL]
   }
}

function getCellInfo(str) {
   const [cL, rL] = str.split('');
   return {
      col: cL,
      raw: Number(rL),
      colV: colValDict[cL],
      rawP: 9 - Number(rL),
   }
}

export {
   getFigureInfo,
   getCellInfo
}