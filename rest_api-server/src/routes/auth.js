const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const controller = require('../controllers/auth');

router.post('/login', controller.login);

router.get('/data', authMiddleware, controller.getAuthData);

module.exports = router;
