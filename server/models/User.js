const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        fullName: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        profilePicture: {
            type: String,
            default: '',
        },
        gender: {
            type: String,
            default: 'male',
        },
        phoneNumber: {
            type: String,
            default: '',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        city: {
            type: String,
            max: 50,
            default: '',
        },
        from: {
            type: String,
            max: 50,
            default: '',
        },
        wallet: {
            type: String,
            required: true,
        },
        Date: {
            type: Date,
        },
        role: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
