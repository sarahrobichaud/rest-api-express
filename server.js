const path = require('path');
const express = require('express');
const socket = require('socket.io');
const colors = require('colors');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const errorHandler = require('./middleware/error');
const morgan = require('morgan');
const xxsClean = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const fs = require('fs');
const cors = require('cors');
const app = express();

const set = JSON.parse(fs.readFileSync('data/set.json', 'UTF8'));

//Middleware
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.use(cookieParser());

//Security
app.use(mongoSanitize());
app.use(helmet());
app.use(xxsClean());
app.use(hpp());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 100000
});

app.use(limiter);

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

//Socket io
const io = socket(server);
const solo = io.of('/play/solo');
solo.on('connection', function(socket) {
  console.log(`${socket.id} connected`.bgBlue.black);
  socket.emit('connection_made', { msg: 'Connected', set });
});
