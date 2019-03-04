/**
 * Created by Jerome on 03-03-17.
 */

const Client = {};
Client.socket = io.connect();

Client.sendTest = () => {
  console.log("test sent");
  Client.socket.emit('test');
};

Client.askNewPlayer = () => {
  Client.socket.emit('newplayer');
};

Client.sendClick = (x,y) => {
  Client.socket.emit('click',{x, y});
};

Client.socket.on('newplayer', (data) => {
  Game.addNewPlayer(data.id, data.x, data.y);
});

Client.socket.on('allplayers', (data) => {
  for (let i = 0, max = data.length; i < max; i++){
    Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
  }

  Client.socket.on('move', (data) => {
    Game.movePlayer(data.id, data.x - 32, data.y - 50);
  });

  Client.socket.on('remove', (id) => {
    Game.removePlayer(id);
  });
});
