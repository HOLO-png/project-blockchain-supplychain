const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
            default: '',
        },
        creator: {
            type: String,
        },
        addressCreator: {
            type: String,
            required: true,
        },
        addressProduct: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            required: true,
        },
        indexProduct: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Product', ProductSchema);
