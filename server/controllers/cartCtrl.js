const Cart = require('../models/Cart.js');
const Product = require('../models/Product.js');
const mongoose = require('mongoose');

const cartCtrl = {
    createCartToUser: async (req, res) => {
        try {
            const { id } = req.user;
            const userCart = await Cart.findOne({ userId: id });

            if (userCart) {
                return res.status(200).json(userCart);
            } else {
                const newUserCart = new Cart({
                    userId: id,
                    cart: {
                        items: [],
                        totalPrice: 0,
                    },
                });
                const cartUserNew = await newUserCart.save();
                return res.status(200).json(cartUserNew);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
    addProductToCart: async (req, res) => {
        try {
            const { productId } = req.body;
            const { cartId } = req.params;
            const cartIdObj = mongoose.Types.ObjectId(cartId);

            const product = await Product.findById({ _id: productId });
            const cartUser = await Cart.findById({ _id: cartIdObj });

            if (cartUser) {
                if (product) {
                    const isExisting = cartUser.cart.items.findIndex(
                        (objInItems) =>
                            new String(objInItems.productId).trim() ===
                            new String(product._id).trim(),
                    );
                    if (isExisting >= 0) {
                        cartUser.cart.items[isExisting].qty += 1;
                    } else {
                        cartUser.cart.items.push({
                            productId: product._id,
                            qty: 1,
                        });
                    }
                    if (!cartUser.cart.totalPrice) {
                        cartUser.cart.totalPrice = 0;
                    }
                    cartUser.cart.totalPrice += product.price;
                    const data = await cartUser.save();
                    return res.status(200).json(data.cart);
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
    getCartProducts: async (req, res) => {
        try {
            const { cartId } = req.params;
            const cartUser = await Cart.findOne({ _id: cartId });
            const arrayCart = [];
            const cartProducts = await Promise.all(
                cartUser.cart.items.map((product) => {
                    return Product.find({ _id: product.productId });
                }),
            );

            cartProducts.forEach((cartProduct) => {
                cartUser.cart.items.forEach((product) => {
                    if (cartProduct[0]._id.toString() === product.productId) {
                        arrayCart.push({
                            product: cartProduct[0],
                            qty: product.qty,
                        });
                    }
                });
            });

            return res.status(200).json(arrayCart);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
    removeProductToCart: async (req, res) => {
        try {
            const { cartId } = req.params;
            const { productId, price } = req.body;
            const cartUser = await Cart.findOne({ _id: cartId });

            const isExisting = cartUser.cart.items.findIndex(
                (objInItems) =>
                    new String(objInItems.productId).trim() ===
                    new String(productId).trim(),
            );

            if (isExisting >= 0) {
                if (cartUser.cart.totalPrice) {
                    if (cartUser.cart.items[isExisting]) {
                        const priceProduct =
                            cartUser.cart.items[isExisting].qty;
                        cartUser.cart.totalPrice -= price * priceProduct;
                    }
                    cartUser.cart.items.splice(isExisting, 1);
                    cartUser.save();
                    return res.status(200).json(cartUser);
                }
            } else {
                throw 500;
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
    updateAmountProductToCart: async (req, res) => {
        try {
            const { cartId } = req.params;
            const { productId, amount, price } = req.body;

            const cartUser = await Cart.findOne({ _id: cartId });

            const isExisting = cartUser.cart.items.findIndex(
                (objInItems) =>
                    new String(objInItems.productId).trim() ===
                    new String(productId).trim(),
            );

            if (isExisting >= 0) {
                if (cartUser.cart.items[isExisting]) {
                    const qtyProduct =
                        amount - cartUser.cart.items[isExisting].qty;
                    cartUser.cart.totalPrice += price * qtyProduct;
                }
                cartUser.cart.items[isExisting].qty = amount;
                cartUser.save();
                return res.status(200).json(cartUser);
            } else {
                throw 500;
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
    resetCart: async (req, res) => {
        try {
            const { cartId } = req.params;

            const cartUser = await Cart.findOne({ _id: cartId });

            if (cartUser) {
                cartUser.cart.items = [];
                cartUser.cart.totalPrice = 0;
                cartUser.save();
                return res.status(200).json(cartUser);
            } else {
                throw 500;
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = cartCtrl;
