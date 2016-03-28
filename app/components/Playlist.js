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
	  	const playSong = this.playSong;
	  	const addSong = this.addSong;
	  	const tracks = this.props.playlist.searchTracks.map(function(element, index) {

	  		return (
	  			<div onClick={addSong.bind(null, element)} key={index + 1}> <img height='20' width='20' src={element.artwork_url}></img> {element.title} </div>
	  		)

	  	})

	  	const playlist = this.props.playlist.playlist.map(function(element, index) {

	  		return (
	  			<div onClick={playSong.bind(null, element)} key={index + 1}> <img height='20' width='20' src={element.artwork_url}></img> {element.title} </div>
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
		      <div>
		      Playlist:
		      {playlist}
		      </div>
	      </div>

	    )
	  },

	  playSong: function(song) {
			this.props.PlaylistActions.playTrack(song);
		},

		addSong: function(song) {
			this.props.PlaylistActions.addSongToPlaylist(song);
		}
});

module.exports = Playlist;