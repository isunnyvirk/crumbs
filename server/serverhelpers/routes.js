const userController = require('../db/user/userController.js');
const treasureChestController = require('../db/treasureChest/treasureChestController.js');

module.exports = (socket, io) => {
  socket.on('updateTreasureState', (location) => {
    treasureChestController.updateTreasureState(location, socket);
  });

  socket.on('getTreasureChests', () => {
    treasureChestController.getTreasureChests(socket);
  });

  socket.on('validateUserLogin', (userCredentials) => {
    userController.validateUserLogin(userCredentials.username, userCredentials.password, socket);
  });

  socket.on('validateUserSignup', (userCredentials) => {
    userController.validateUserSignup(userCredentials.username, userCredentials.password, socket);
  });

  socket.on('updateUserPoints', (userObj) => {
    userController.updateUserPoints(userObj.username, userObj.location, socket);
  });

  socket.on('getUserScore', (userObj) => {
    userController.getUserScore(userObj.username, socket);
  });

  socket.on('getUserChests', (userObj) => {
    userController.getUserChests(userObj.username, socket);
  });

  socket.on('location', function (data) {
    io.sockets.emit('location', data);
  });
};
