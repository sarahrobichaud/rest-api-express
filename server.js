const express = require('express');
const socket = require('socket.io');
const colors = require('colors');
const fs = require('fs');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const morgan = require('morgan');
const connectToDB = require('./utils/db');
const cors = require('cors');
const app = express();

const getPlayer = require('./utils/getPlayer');

//Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});
//Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Server
const PORT = process.env.PORT || 2000;
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgYellow
      .black
  )
);

//Connection to database
connectToDB(process.env.DB_STRING);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection made with database'.bgBlue.black);
});

//Routes
const usersRoute = require('./routes/users');
app.use('api/v1/users', usersRoute);
