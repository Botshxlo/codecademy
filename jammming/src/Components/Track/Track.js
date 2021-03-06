import React from 'react';
import './Track.css';

import PlayButton from '../PlayButton/PlayButton';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  renderAction(isRemoval) {
    if(isRemoval) {
      return <a onClick={this.removeTrack} className="Track-action">-</a>;
    }
    return <a onClick={this.addTrack} className="Track-action">+</a>;
  }
  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <PlayButton
            sample={this.props.track.sample}
            id={this.props.track.id}
            playing={this.props.playing}
            isPlaying={this.props.isPlaying}

           />
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.renderAction(this.props.isRemoval)}
      </div>
);
  }
}

export default Track;
