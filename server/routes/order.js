const router = require('express').Router();
const orderCtrl = require('../controllers/orderCtrl.js');

router.post('/', orderCtrl.createOrderProduct);
router.get('/all', orderCtrl.getOrderProductUserAll);
router.get('/:userId', orderCtrl.getOrderProductUser);
router.patch('/:id', orderCtrl.updateOrderStatus);
router.delete('/:id', orderCtrl.deleteOrderStatus);


module.exports = router;
