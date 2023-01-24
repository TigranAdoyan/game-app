

class Game {
    constructor(game) {
       this.id = game.id;
       this.playersIds = game.playersIds;
       this.state = game.state;
    }
}

class SyncData {
   static types = {
      common: 'common',
      individual: 'individual'
   }

   constructor(type) {
      this.type = SyncData.types[type]
      this.payload = {};
   }

   isCommon() {
      return this.type === SyncData.types.common;
   }

   isIndividual() {
      return this.type === SyncData.types.individual;
   }

   pushSyncData(syncData, playerId) {
      if (this.type === SyncData.types.common) this.payload = syncData;
      else if (this.type === SyncData.types.individual) this.payload[playerId] = syncData;
   }
}

module.exports = {
   Game,
   SyncData
}