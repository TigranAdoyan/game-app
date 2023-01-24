const { Worker } = require('worker_threads');
const path = require('path');

function runGameWorker(props) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, `./workers/${props.method}.js`), {
            workerData: {
                gameState: props.gameState,
                playerId: props.playerId
            }
        });
        worker.on('message',resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        })
    })
}

function generateResult(props) {
    return {
        isGameStateUpdated: props.isGameStateUpdated,
        gameState: props.gameState,
        syncData: props.syncData
    }
}

module.exports = {
    runGameWorker,
    generateResult
};
