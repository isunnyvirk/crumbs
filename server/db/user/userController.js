const User = require('./userModel.js');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = {
  validateUserLogin: (username, password, socket) => {
    User.findOne({ 'username': username }, (err, userData) => {
      var user = false;
      if (userData) {
        user = userData.password === password ? username : false;
        if (!user) {
          socket.emit('Authentication', false);
        }
        socket.emit('Authentication', userData);
      } else {
        socket.emit('Authentication', false);
      }
    });
  },

  validateUserSignup: (username, password, socket) => {
    User.findOne({ 'username': username }, (err, userData) => {
      if (userData) {
        socket.emit('Authentication', false);
      } else {
        User.create({
          username,
          password,
        }).then((createdUser) => {
          console.log(createdUser);
          socket.emit('Authentication', createdUser);
        }).catch((err) => {
          console.log('Failed to create User Data', err);
        });
      }
    });
  },

  updateBankedCoins: (username, coins, socket) => {
    console.log(username, ' banking coins!')
    User.findOne({ username }, (err, userData) => {
      userData.locations.concat(coins);
      userData.markModified('locations');
      userData.save(() => {
      });
    });
  },

  getUserScore: (username, socket) => {
    User.findOne({ username }, (err, userData) => {
      if (userData) {
        socket.emit('getUserScore', userData.points);
      } else {
        socket.emit('getUserScore', 0);
      }
    });
  },

  getBankedCoins: (username, socket) => {
    console.log(username, " is banking!", username)
    User.findOne({ username }, (err, userData) => {
      if (userData) {
        socket.emit('getBankedCoins', userData.locations);
      } else {
        socket.emit('getBankedCoins', []);
      }
    });
  },
};
