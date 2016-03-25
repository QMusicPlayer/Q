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
			this.props.PlaylistActions.searchTracks(event.nativeEvent.target.value)			
		},
	  render: function () {
	    return (
	      <div>
	      	<input onChange={this.searchSong}/>
		     <SoundPlayerContainer resolveUrl={resolveUrl} clientId={clientId}>
		   		<Player/>
		     </SoundPlayerContainer>
	      </div>
	    )
	  }
});

module.exports = Playlist;