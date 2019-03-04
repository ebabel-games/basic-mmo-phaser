/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

const Game = {};

Game.init = () => {
  game.stage.disableVisibilityChange = true;
};

Game.preload = () => {
  game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
  game.load.image('sprite','assets/sprites/sprite.png');
};

Game.create = () => {
  Game.playerMap = {};

  const testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  testKey.onDown.add(Client.sendTest, this);
  
  const map = game.add.tilemap('map');
  map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
  
  let layer;
  for (let i = 0, max = map.layers.length; i < max; i++) {
    layer = map.createLayer(i);
  }

  layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
  layer.events.onInputUp.add(Game.getCoordinates, this);
  Client.askNewPlayer();
};

Game.getCoordinates = (layer, pointer) => {
  Client.sendClick(pointer.worldX, pointer.worldY);
};

Game.addNewPlayer = (id, x, y) => {
  Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
};

Game.movePlayer = (id, x, y) => {
  const player = Game.playerMap[id];
  const distance = Phaser.Math.distance(player.x, player.y, x, y);
  const tween = game.add.tween(player);
  const duration = distance*10;
  tween.to({x, y}, duration);
  tween.start();
};

Game.removePlayer = (id) => {
  Game.playerMap[id].destroy();
  delete Game.playerMap[id];
};
