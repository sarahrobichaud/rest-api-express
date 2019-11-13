const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const errorHandler = require('./middleware/error');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

//Middleware
app.use(express.json());
app.use(cors());
//Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
//Routes
const usersRoute = require('./routes/users');
app.use('/api/v1/users', usersRoute);
app.use(errorHandler);

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

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
