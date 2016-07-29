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

  updateUserPoints: (username, location,  socket) => {
    console.log('updating user points for this loc: ', location);
    User.findOne({ username }, (err, userData) => {
      if (userData) {
        var flag = true;
        if (userData.locations.length < 1) {
          userData.locations.push(location);
          userData.points++;
          userData.markModified('locations', 'points');
          userData.save(() => {
          });
          socket.emit('updateUserPoints', true);
        } else {
          for (var i = 0; i < userData.locations.length; i++) {
            if (userData.locations[i] === location) {
              socket.emit('updateUserPoints', false);
              flag = false;
            }
          }
          if (flag) {
            userData.locations.push(locations);
            userData.points++;
            userData.markModified('locations', 'points');
            userData.save(() => {
              console.log('saving new userData');
            });
            socket.emit('updateUserPoints', true);
            socket.emit('getUserChests', userData.locations);
          }
        }
      }
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

  getUserChests: (username, socket) => {
    User.findOne({ username }, (err, userData) => {
      if (userData) {
        socket.emit('getUserChests', userData.locations);
      } else {
        socket.emit('getUserChests', []);
      }
    });
  },
};
