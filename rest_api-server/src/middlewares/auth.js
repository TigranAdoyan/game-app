const authService = require('../services/auth');

module.exports = async function auth(req, res, next) {
     try {
        req.user = await authService.auth(req.headers['x-auth-token']);
        next();
     } catch (err) {
        next(err);
     }
}