class ErrorHandler {
   constructor(game) {
     this.game = game;

      this.errorCodes = {
         auth_error: 'auth_error',
         invalid_auth_token: 'invalid_auth_token',
         invalid_game_id: 'invalid_game_id'
      };

      this.errorCodesDict = {
         [this.errorCodes.invalid_game_id]: this._invalid_game_id.name
      }
   }

   onError(code) {
       debugger;
      if (this.errorCodesDict[code]) this[this.errorCodesDict[code]]()
   }

   _invalid_game_id() {
       debugger;
   }
}

export default ErrorHandler
