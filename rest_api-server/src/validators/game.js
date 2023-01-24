const Joi = require('joi');

module.exports = {
   invite: {
      body: Joi.object({
         receiverId: Joi.number().required(),
         message: Joi.string().required()
      })
   }
};
