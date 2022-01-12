const router = require('express').Router();
const authCtrl = require('../controllers/authCtrl.js');
const auth = require('../middleware/auth.js');

router.post('/register', authCtrl.register);

router.post('/activate', authCtrl.activateEmail);

router.post('/login', authCtrl.login);

router.post('/refresh_token', authCtrl.getAccessToken);

router.get('/logout', authCtrl.logout);

module.exports = router;
