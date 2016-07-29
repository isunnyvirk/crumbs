import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import io from 'socket.io-client';

const mainSocket = io();
// change for deploy
var hello = 'hi';

ReactDOM.render(
  <App mainSocket={mainSocket} />,
  document.getElementById('app')
);
