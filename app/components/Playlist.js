import { PlayButton, Progress, Icons } from 'react-soundplayer/components';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import React from 'react';
import {Player} from './Player.js';
const { SoundCloudLogoSVG } = Icons;
const clientId = 'f270bdc572dc8380259d38d8015bdbe7';

//Test track
const resolveUrl = 'https://soundcloud.com/harp00n/like-ooooh-w-alicia';

const Playlist = React.createClass({
		searchSong: function (event) {
			this.props.PlaylistActions.searchTracks(event.nativeEvent.target.value);

		},
	  render: function () {
	  	var tracks = this.props.playlist.tracks.map(function(element, index) {
	  		return (
	  			<li key={index + 1}>{index + 1}. {element.title}</li>

	  		)
	  	})
	    return (
	      <div>
		      <input onChange={this.searchSong}></input>
			    <SoundPlayerContainer resolveUrl={resolveUrl} clientId={clientId}>
			   		<Player></Player>
			    </SoundPlayerContainer>
			    <div>
			    	Tracks:
		      	{tracks}
		      </div>
	      </div>

	    )
	  }
});

module.exports = Playlist;