const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const authRouter = require('./auth');
const gameRouter = require('./game');

router.use('/auth', authRouter);
router.use(authMiddleware);
router.use('/game', gameRouter);
router.use(errorHandler);

module.exports = router;

function errorHandler(err, req, res, next) {
   console.log('err.message', err.message);
   if (err instanceof HttpError) {
      return res.status(err.code).json({
         message: err.message
      })
   } else {
      return res.status(400).json({
         message: 'Server internal error'
      })
   }
}