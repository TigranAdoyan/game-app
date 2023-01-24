const { workerData, parentPort } = require('worker_threads');
const {gameState, playerId} = workerData;


parentPort.postMessage({
    isGameStateUpdated: false
})
