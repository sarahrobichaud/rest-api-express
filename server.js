const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const errorHandler = require('./middleware/error');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

//Middleware
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.use(cookieParser());

//Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
const usersRoute = require('./routes/users');
const statsRoute = require('./routes/stats');
const authRoute = require('./routes/auth');
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/auth', authRoute);
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
