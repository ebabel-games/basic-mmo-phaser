const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081, () => {
  console.log(`Game server running on on port ${server.address().port}.`);
});

io.on('connection', (socket) => {
  socket.on('newplayer', () => {
    socket.player = {
      id: server.lastPlayderID++,
      x: randomInt(100, 400),
      y: randomInt(100, 400),
    };
    socket.emit('allplayers', getAllPlayers());
    socket.broadcast.emit('newplayer', socket.player);

    socket.on('click', (data) => {
      console.log(`Click to ${data.x}, ${data.y}.`);
      socket.player.x = data.x;
      socket.player.y = data.y;
      io.emit('move', socket.player);
    });

    socket.on('disconnect', () => {
      io.emit('remove', socket.player.id);
    });
  });

  socket.on('test', () => {
    console.log('test received');
  });
});

const getAllPlayers = () => {
  const players = [];

  Object.keys(io.sockets.connected).forEach((socketID) => {
    const player = io.sockets.connected[socketID].player;
    if (player) {
      players.push(player);
    }
  });

  return players;
};

const randomInt = (low, high) =>
  Math.floor(Math.random() * (high - low) + low);
