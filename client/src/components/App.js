import React from 'react';
import { Authentication } from './Authentication';
import { Authenticated } from './Authenticated';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: null,
      location: '37.7835-122.4096',
      // demoMode: true,
      userLoggedIn: true,
      center: { lat: 37.7843, lng: -122.4096 },
      zoom: 15,
      counter: 0.0001,
      score: 0  
    };
  }

  componentWillMount() {
    // this.addMessageToChatRoom = this.addMessageToChatRoom.bind(this);
    // this.createChatRoom = this.createChatRoom.bind(this);
    this.logOutUser = this.logOutUser.bind(this);

    // selects and executes which source to use for setting the location state of 
    // user. 
    const locationSource = this.updateLocationState.bind(this);
    setInterval(locationSource, 2000);


    //listens for a messages update from the main server
    this.props.mainSocket.on('updateMessagesState', (location) => {
        if (location) {
          this.setState({
            score++
          })
          this.updateUserPoints();
        }
      });

      console.log('MESSAGE: ', location)
    });

    this.props.mainSocket.on('Authentication', (user) => {
      this.setState({
        userLoggedIn: user,
      });
    });
  }

  updateUserPoints() {
    this.props.mainSocket.emit('updateUserPoints', this.state.score)
  }

  //will continulally update our location state with our new position returned form navigator.geolocation and check if we are in chat room
  setPosition(position) {
    const latRound = position.coords.latitude.toFixed(4);
    const lonRound = position.coords.longitude.toFixed(4);
    const location = latRound.toString() + lonRound.toString();
    this.setState({
      location,
    });
    this.updateMessagesState();
  }

  //will watch our location and frequently call set position
  updateLocationState() {
    //need this, every individual call to move
    var dummyLat = 37.7800;
    var dummyLon = -122.4096;
    let position = {};
    position.coords = {};
    position.coords.latitude = dummyLat + this.state.counter;
    position.coords.longitude = dummyLon;
    this.setPosition(position);
    var reCount = this.state.counter + 0.0001;
    this.setState({
      counter: reCount,
    })

    //listens for a location update from the demo server
    // this.props.demoSocket.on('updateLocationStateDemo', (data) => {
    //   this.setPosition(position);
    // });

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(this.setPosition.bind(this), this.error);
    // } else {
    //   console.log('geolocation not supported');
    // }
  }

  //socket request to demo server to update the state of the location of the app
  updateLocationStateDemo() {
    this.props.demoSocket.emit('updateLocationStateDemo', null);
  }

  //socket request to the main server to update messages state based on location state
  updateMessagesState() {
    this.props.mainSocket.emit('updateMessagesState', this.state.location);
  }

  //socket request to the main server to create a new chatroom
  createChatRoom() {
    this.props.mainSocket.emit('createChatRoom', this.state.location);
  }

  //socket request to chatroom to append a new message to
  addMessageToChatRoom(message) {
    this.props.mainSocket.emit('addMessageToChatRoom', { location: this.state.location, message, username: this.state.userLoggedIn });
  }

  logOutUser() {
    this.setState({
      userLoggedIn: false,
    });
  }

  render() {
    const loggedIn = (
      <Authenticated
        dummyLat={Number(this.state.location.slice(0,6))}
        dummyLong={-122.4096}
        messages={this.state.messages}
        userLoggedIn={this.state.userLoggedIn}
        addMessageToChatRoom={this.addMessageToChatRoom}
        createChatRoom={this.createChatRoom}
        logOutUser={this.logOutUser}
        zoom={this.state.zoom}
        center={this.state.center}
      />
    );

    const notLoggedIn = (
      <Authentication
        mainSocket={this.props.mainSocket}
      />
    );

    let childToRender = !!this.state.userLoggedIn ? loggedIn : notLoggedIn;

    return (
      <div>
        {childToRender}
      </div>
    );
  }
}
