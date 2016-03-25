import {actions} from '../constants'

const searchTracks = (searchText) => {
	console.log('in actions')
	SC.initialize({
      client_id: 'f270bdc572dc8380259d38d8015bdbe7'
  });

  return function (dispatch) {
  	SC.get('/tracks', {
  	    q: searchText,
  	}).then(function(tracks) {
	    	dispatch({
	    		type: actions.SEARCH_RESULTS,
	    		payload: tracks
	    	});
  	});
  }
}

module.exports = {
	searchTracks: searchTracks
}