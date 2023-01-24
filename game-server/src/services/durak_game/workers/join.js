const { workerData, parentPort } = require('worker_threads');
const {gameState, playerId} = workerData;
const { gameStatues } = require('../contstants');

if (gameState.status === gameStatues.waiting && gameState.playersIds.includes(playerId) && !gameState.connectedPlayersIds.includes(playerId)) {
   gameState.connectedPlayersIds.push(playerId);
   const syncData = {};

   gameState.connectedPlayersIds.forEach(playerId => {
      syncData[playerId] = {
         connectedPlayersIds: gameState.connectedPlayersIds,
      }
   });

   parentPort.postMessage({
      isGameStateUpdated: true,
      gameState,
      syncData,
   });
} else {
   parentPort.postMessage({
      isGameStateUpdated: false
   })
}
