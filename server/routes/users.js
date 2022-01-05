const router = require('express').Router();
const auth = require('../middleware/auth.js');
const usersCtrl = require('../controllers/usersCtrl.js');

// get user admin
router.get('/', auth, usersCtrl.getUserInfo);

module.exports = router;
