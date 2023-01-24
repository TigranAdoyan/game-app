const router = require('express').Router();
const controller = require('../controllers/game');

router.post('/invite', controller.inviteToGame);

module.exports = router;
