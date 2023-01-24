const auth = require('./auth');
const game = require('./game');

const schemas = {
   auth,
   game
};

function controllerValidator(controller) {
   return new Proxy(controller, {
      get(target, propKey) {
         if (typeof target[propKey] === 'function') {
            return new Proxy(target[propKey], {
               async apply(method, handler, args) {
                  try {
                     const validationSchema = schemas[controller.name];
                     if (validationSchema && validationSchema[method.name]) {
                        Object.keys(validationSchema[method.name]).forEach(key => {
                           // args[0] => req; key => ['body', 'query', 'params'];
                           console.log('args[0][key]', args[0][key]);
                           const validationResult = validationSchema[method.name][key].validate(args[0][key]);
                           if (validationResult.error) {
                              throw new HttpError(validationResult.error.message, HttpError.statusCodes.BAD_REQUEST);
                           }
                        })
                     }
                     return method.apply(controller, args)
                         .catch(err => args[args.length - 1](err));
                  } catch (err) {
                     args[args.length - 1](err);
                  }
               }
            })
         }
         return target[propKey];
      }
   })
}

module.exports = controllerValidator;
