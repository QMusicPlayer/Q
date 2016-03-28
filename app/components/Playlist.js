import { PlayButton, Progress, Icons } from 'react-soundplayer/components';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import React from 'react';
import {Player} from './Player.js';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import ActionInfo from 'material-ui/lib/svg-icons/action/info';
import ContentInbox from 'material-ui/lib/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/lib/svg-icons/content/drafts';
import ContentSend from 'material-ui/lib/svg-icons/content/send';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';
import TextField from 'material-ui/lib/text-field';
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
	  			<ListItem onClick={addSong.bind(null, element)} key={index + 1} leftAvatar={<Avatar src={element.artwork_url} />}> {element.title} </ListItem>
	  		)

	  	})

	  	const playlist = this.props.playlist.playlist.map(function(element, index) {

	  		return (
	  			<ListItem onClick={playSong.bind(null, element)} key={index + 1} leftAvatar={<Avatar src={element.artwork_url} />}>{element.title} </ListItem>
	  		)

	  	})
	    return (
	      <div>
	      	<TextField hintText="Search Soundcloud" onChange={this.searchSong}/>
			    <SoundPlayerContainer resolveUrl={resolveUrl} clientId={clientId}>
			   		<Player track={this.props.playlist.current}></Player>
			    </SoundPlayerContainer>
			    <List>
			    	Tracks:
		      	{tracks}
		      </List>
		      <List>
		      Playlist:
		      {playlist}
		      </List>
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