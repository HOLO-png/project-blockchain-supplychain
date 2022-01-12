const router = require('express').Router();
const auth = require('../middleware/auth.js');
const productsCtrl = require('../controllers/productsCtrl.js');

// get pproduct admin
router.post('/', productsCtrl.createProduct);
router.get('/', productsCtrl.getProducts);
router.patch('/:id', productsCtrl.updateStatusProduct);
router.put('/:id', auth, productsCtrl.updateProduct);
router.delete('/:id', productsCtrl.deleteProduct);
router.get('/:wallet', productsCtrl.getUsersAllProducts);

module.exports = router;
