const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEMail = require('../utils/sendMail.js');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const userCtrl = {
    register: async (req, res) => {
        try {
            const { username, password, email, wallet } = req.body;
            if (!username || !password || !email || !wallet) {
                return res.status(400).json({
                    success: false,
                    message: 'missing username, password, email!',
                });
            }

            if (!validateEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'invalid Email!',
                });
            }

            const user = await User.findOne({ email, wallet });
            const address_wallet = await User.findOne({ wallet });

            if (address_wallet)
                return res.status(400).json({
                    msg: 'This email and/or password/or address_wallet does not exists!',
                });

            if (user) {
                return res.status(400).json({
                    success: false,
                    message: 'this email already exists!',
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'invalid password!',
                });
            }

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = new User({
                username: username,
                email: email,
                password: passwordHash,
                wallet,
            });

            const activation_token = createActivationToken(newUser);

            const url = `${process.env.CLIENT_URL}/activate/${activation_token}`;

            sendEMail(email, url, username, 'Please verify your email!');

            res.status(200).json({ msg: 'Register success!!' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body;

            const user = jwt.verify(
                activation_token,
                process.env.ACTIVATION_TOKEN_SECRET,
            );

            const { username, email, password, wallet } = user;

            const check = await User.findOne({ email, wallet });
            if (check) {
                return res
                    .status(400)
                    .json({ msg: 'this email already exists' });
            }

            const newUser = new User({
                username,
                email,
                password,
                wallet,
            });

            const userObj = await newUser.save();
            const refresh_token = createRefreshToken({
                id: userObj._id,
                wallet: userObj.wallet,
            });

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/auth/refresh_token',
                maxAge: 7 * 4 * 60 * 60 * 1000, // 7 days
            });

            return res.status(200).json(newUser);
        } catch (error) {
            console.log(error);

            return res.status(500).json({ msg: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password, wallet } = req.body;
            const user = await User.findOne({ email });
            const address_wallet = await User.findOne({ wallet });

            if (!address_wallet)
                return res.status(400).json({
                    msg: 'This email and/or password/or address_wallet does not exists!',
                });

            if (!user)
                return res.status(400).json({
                    msg: 'This email and/or password/or address_wallet does not exists!',
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    msg: 'This email and/or password/or address_wallet does not exists!',
                });

            const refresh_token = createRefreshToken({
                id: user._id,
                wallet: user.wallet,
            });

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/auth/refresh_token',
                maxAge: 7 * 4 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;

            if (!rf_token) {
                return res.status(400).json({ msg: 'please login now!' });
            }

            jwt.verify(
                rf_token,
                process.env.REFRESH_TOKEN_SECRET,
                (err, user) => {
                    if (err) {
                        return res
                            .status(400)
                            .json({ msg: 'please login now!' });
                    }
                    const access_token = createAccessToken({
                        id: user.id,
                        wallet: user.wallet,
                    });

                    res.status(200).json({ access_token });
                },
            );
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {
                path: '/api/auth/refresh_token',
                httpOnly: true,
            });

            return res.status(200).json({
                msg: 'Logged out!',
            });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

const validateEmail = (email) => {
    const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
};

const createActivationToken = (payload) => {
    return jwt.sign(payload.toJSON(), process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: '5m',
    });
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
};

module.exports = userCtrl;
