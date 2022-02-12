const Order = require('../models/Order.js');

const order = {
    createOrderProduct: async (req, res) => {
        const newOrder = new Order(req.body);
        try {
            const savedOrder = await newOrder.save();
            res.status(200).json(savedOrder);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    getOrderProductUser: async (req, res) => {
        try {
            const userId = req.params.userId.toString();
            const orderUser = await Order.find({ userId });

            return res.status(200).json(orderUser);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    getOrderProductUserAll: async (req, res) => {
        try {
            const orderUser = await Order.find();
            res.status(200).json(orderUser);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
};

module.exports = order;
