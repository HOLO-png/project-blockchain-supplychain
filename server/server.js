const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/users.js');
const authRoute = require('./routes/auth.js');
const productsRoute = require('./routes/products.js');
const cartRoute = require('./routes/cart.js');
const orderRoute = require('./routes/order.js');

const app = express();
require('dotenv').config();
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('common'));
app.use(cors({ origin: true, credentials: true }));

//mail sender detail
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productsRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Backend server is running with Port ${PORT}`);
});
