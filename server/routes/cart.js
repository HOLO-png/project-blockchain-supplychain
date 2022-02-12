const router = require('express').Router();
const auth = require('../middleware/auth.js');
const cartCtrl = require('../controllers/cartCtrl.js');

router.post('/', auth, cartCtrl.createCartToUser);
router.post('/:cartId', cartCtrl.addProductToCart);
router.get('/:cartId', cartCtrl.getCartProducts);
router.delete('/:cartId', cartCtrl.removeProductToCart);
router.put('/:cartId', cartCtrl.updateAmountProductToCart);
router.put('/reset/:cartId', cartCtrl.resetCart);

module.exports = router;
