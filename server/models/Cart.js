const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        cart: {
            items: [
                {
                    productId: {
                        type: String,
                        required: true,
                    },
                    qty: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            totalPrice: Number,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Cart', CartSchema);
