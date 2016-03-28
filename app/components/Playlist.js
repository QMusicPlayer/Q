import { PlayButton, Progress, Icons } from 'react-soundplayer/components';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import React from 'react';
import {Player} from './Player.js';
const { SoundCloudLogoSVG } = Icons;
const clientId = 'f270bdc572dc8380259d38d8015bdbe7';

//Test track


const Playlist = React.createClass({
		searchSong: function (event) {
			this.props.PlaylistActions.searchTracks(event.nativeEvent.target.value);

		},
	  render: function () {
	  	const resolveUrl = this.props.current;
	  	const playSong = this.playSong
	  	const tracks = this.props.playlist.tracks.map(function(element, index) {

	  		return (
	  			<div onClick={playSong.bind(this, element)} key={index + 1}> <img height='20' width='20' src={element.artwork_url}></img> {element.title} </div>
	  		)

	  	})
	    return (
	      <div>
		      <input onChange={this.searchSong}></input>
			    <SoundPlayerContainer resolveUrl={resolveUrl} clientId={clientId}>
			   		<Player track={this.props.playlist.current}></Player>
			    </SoundPlayerContainer>
			    <div>
			    	Tracks:
		      	{tracks}
		      </div>
	      </div>

	    )
	  },

	  playSong: function(url) {
			this.props.PlaylistActions.playTrack(url)
		}
});

module.exports = Playlist;