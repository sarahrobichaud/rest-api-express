const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const mongoose = require('mongoose');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

//Middleware
app.use(express.json());
app.use(cors());

//Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Server
const PORT = process.env.PORT || 2000;
const server = app.listen(PORT, () =>
  console.log(
    `Server running in`.yellow,
    `${process.env.NODE_ENV} mode`.cyan,
    `on port`.yellow,
    `${PORT}`.cyan.black
  )
);

//Connection to database
connectDB();

//Routes
const usersRoute = require('./routes/users');
app.use('/api/v1/users', usersRoute);
