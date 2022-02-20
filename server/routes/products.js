const router = require('express').Router();
const auth = require('../middleware/auth.js');
const productsCtrl = require('../controllers/productsCtrl.js');

// get product admin
router.post('/order/item', productsCtrl.getProductsToOrder);
router.post('/', productsCtrl.createProduct);
router.get('/', productsCtrl.getProducts);
router.patch('/:id', productsCtrl.updateStatusProduct);
router.put('/:id', auth, productsCtrl.updateProduct);
router.delete('/:id', productsCtrl.deleteProduct);
router.get('/:wallet', productsCtrl.getUsersAllProducts);
router.get('/item/:addressItem', productsCtrl.getProduct);
router.patch('/', productsCtrl.updateProductsToCart);




module.exports = router;
