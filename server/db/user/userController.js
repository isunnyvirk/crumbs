const User = require('./userModel.js');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = {
  validateUserLogin: (username, password, socket) => {
    User.findOne({ 'username': username }, (err, userData) => {
      var user = false;
      if (userData) {
        user = userData.password === password ? username : false;
        if (user) {
          var username = userData.username;
        } else {
          var username = undefined;
        }
      }

      var userObj = { username: username, userLoggedIn: user };

      socket.emit('Authentication', userObj);
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
        }).then(() => {
          socket.emit('Authentication', username);
        }).catch((err) => {
          console.log('Failed to create User Data', err);
        });
      }
    });
  },

  updateUserPoints: (username, location,  socket) => {
    User.findOne({ username }, (err, userData) => { 
      console.log('the userdata', userData)
      if (userData) {
        var flag = true;
        for (var i = 0; i < userData.locations.length; i++) {
          if (userData.locations[i] === location) {
            flag = false;
          }
        }
        if (flag) {
          userData.locations.push(location);
          userData.points++;
          socket.emit('updateUserPoints', true);
        } else {
          socket.emit('updateUserPoints', false);
        }
      }
    });
  },
};
