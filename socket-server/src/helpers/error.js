class HttpError extends Error {
   static statusCodes = {
      SUCCESS: 200,
      BAD_REQUEST: 400,
      AUTH_ERROR: 401,
      NOT_FOUND: 404,
      INTERNAL_ERROR: 500
   };

   constructor(message = 'Server internal error', code = HttpError.statusCodes.BAD_REQUEST) {
      super(message);
      this.code = code;
   }
}
module.exports.HttpError = HttpError;


