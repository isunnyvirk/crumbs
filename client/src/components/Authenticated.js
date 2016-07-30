import React from 'react';
import OurMap from './map.js';
import MyNav from './NavBar.js';

export const Authenticated = (props) => {
  const appStyle = {
    margin: 'auto auto',
    width: '80%',
    height: '100%',
    border: '1px solid black',
    padding: '7%',
    textAlign: 'center',
    background: '#CCC',
  };

  let ourMap;
  const mapStyle = { height: screen.height - (0.05 * screen.height) };
  // render the map in all cases
  const googleMap = (
    <div className="map-wrapper mappy" style={mapStyle}>
      <OurMap
        center={props.center}
        zoom={props.zoom}
        coinsOnMap={props.coinsOnMap}
        dummyLat={props.dummyLat}
        dummyLong={props.dummyLong}
        userChests={props.userChests}
        locationsArray={props.locationsArray}
        bankedCoins={props.bankedCoins}
        homebase={props.homebase}
      />
    </div>);

  ourMap = (
    <div className="col-xs-12 wrapper">
      {googleMap}
    </div>);

  return (
    <div>
      <MyNav bankedCoins={props.bankedCoins} carriedCoins={props.carriedCoins} logOutUser={props.logOutUser} username={props.username} />
      {ourMap}
    </div>
  );
};
