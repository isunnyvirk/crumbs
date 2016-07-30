import React from 'react';
import { otherUserSpotStyle, outerDivStyle } from './treasureStyle.js';

export default class otherUsers extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div style={outerDivStyle}>
        <div style={this.props.locationStyle}>
        </div>
      </div>
    );
  }
}
