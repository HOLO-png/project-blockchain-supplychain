const Product = require('../models/Product.js');
// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const product = {
    createProduct: async (req, res) => {
        const newProduct = new Product(req.body);
        try {
            const savedProduct = await newProduct.save();
            res.status(200).json(savedProduct);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    getProducts: async (req, res) => {
        try {
            const products = await Product.find({ status: 0 }).sort(
                '-createdAt',
            );
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (
                product.creator === req.user.id &&
                product.addressCreator === req.user.wallet
            ) {
                const newProduct = await product.updateOne({ $set: req.body });

                res.status(200).json(newProduct);
            } else {
                throw 500;
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
    updateStatusProduct: async (req, res) => {
        try {
            await Product.findOneAndUpdate(
                { _id: req.params.id },
                {
                    status: req.body.status,
                },
            );
            return res.status(200).json('success');
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: res.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);

            await product.deleteOne();
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getUsersAllProducts: async (req, res) => {
        try {
            const { wallet } = req.params;

            const products = await Product.find({ wallet: wallet }).sort(
                '-createAt',
            );

            res.status(200).json(products);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
};

module.exports = product;
