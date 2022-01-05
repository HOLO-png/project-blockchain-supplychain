const User = require('../models/User.js');
// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const user = {
    getUserInfo: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = user;
