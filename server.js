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
const _ = require('lodash');
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
const { syncStats, updateStats } = require('./utils/gameUpdater');
const { calcTotal } = require('./helpers/calcTotal');
const io = socket(server);
const solo = io.of('/play/solo');
const soloRooms = [];
let countdown = 1000;
solo.on('connection', function(socket) {
  // => Connection / Disconnection events
  socket.emit('connection_made', { msg: 'Connected to the server' });

  const saveStats = async () => {
    const index = soloRooms
      .map(item => item.roomName.replace('room-', ''))
      .indexOf(socket.id);

    await updateStats(
      soloRooms[index].player._id,
      soloRooms[index].player.stats
    );
  };
  // When player disconnects
  socket.on('will_disconnect', async () => {
    //Find room
    saveStats();
    solo.to(`room-${socket.id}`).emit('global_update');
    socket.leave(`room-${socket.id}`);
    socket.disconnect();
  });

  socket.on('disconnect', async () => {
    saveStats();
    const index = soloRooms
      .map(item => item.roomName.replace(`room-`, ''))
      .indexOf(socket.id);
    soloRooms.splice(index, 1);
    console.log(soloRooms);

    socket.leave(`room-${socket.id}`);
  });

  // Create solo room
  socket.on('init_room', async data => {
    console.log(`Created and joined room-${socket.id}`);
    socket.join(`room-${socket.id}`);
    const room = {
      roomName: `room-${socket.id}`,
      player: {
        _id: data._id,
        username: data.username,
        stats: {}
      },
      game: {
        set: _.shuffle(_.shuffle(_.shuffle(set))),
        bet: 0,
        change: 0,
        hand: [],
        handTotal: 0,
        dealer: [],
        dealerTotal: 0
      }
    };
    const stats = await syncStats(data._id);
    room.player.stats = stats;

    soloRooms.push(room);
  });

  // => Game logic events
  socket.on('init_bet', data => {
    const index = soloRooms
      .map(item => item.roomName.replace('room-', ''))
      .indexOf(socket.id);

    soloRooms[index].player.stats.tokens -= data.betAmount;
    soloRooms[index].game.bet += data.betAmount;

    solo.to(`room-${socket.id}`).emit('place_bet', { room: soloRooms[index] });
  });

  socket.on('init_deal', data => {
    const index = soloRooms
      .map(item => item.roomName.replace('room-', ''))
      .indexOf(socket.id);

    const getCard = () => {
      return soloRooms[index].game.set.shift();
    };

    const checkAces = arr => {
      let nonAcesTotal = 0;
      const acesIndexes = arr.reduce((myIndexes, item, index) => {
        if (item.name === 'A') {
          myIndexes.push(index);
        } else {
          nonAcesTotal += item.value;
        }
        return myIndexes;
      }, []);

      let numberOfAces = acesIndexes.length;
      if (numberOfAces > 0 && nonAcesTotal + 11 <= 21) {
        const firstAce = arr[acesIndexes[0]];
        firstAce.value = 11;
        if (
          numberOfAces > 1 &&
          nonAcesTotal + 11 + (numberOfAces - 1) * 1 <= 21
        ) {
          const _temp = [...acesIndexes];
          _temp.splice(0, 1);
          _temp.forEach(item => (arr[item].value = 1));
        } else if (nonAcesTotal + 11 + (numberOfAces - 1) * 1 > 21) {
          acesIndexes.forEach(item => (arr[item].value = 1));
        }
      }

      return arr;
    };

    let playerF = getCard();
    let playerS = getCard();
    let dealerF = getCard();
    let dealerS = getCard();
    let player = [];
    let dealer = [];

    const delayCard = (to, myArr, card, timeout) => {
      setTimeout(() => {
        myArr.push(card);
        switch (to) {
          case 'dealer':
            if (myArr.length < 2) {
              myArr[0].hidden = true;
            }
            soloRooms[index].game.dealer = checkAces(myArr);
            break;
          case 'player':
            soloRooms[index].game.hand = checkAces(myArr);
            break;
        }

        solo
          .to(`room-${socket.id}`)
          .emit('deal_hand', { room: soloRooms[index] });
      }, timeout);
    };

    delayCard('player', player, playerF, 0);
    delayCard('dealer', dealer, dealerF, 250);
    delayCard('player', player, playerS, 500);
    delayCard('dealer', dealer, dealerS, 750);
  });
});
