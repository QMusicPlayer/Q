'use strict';
import {actions} from '../constants'
var _ = require('lodash');
//view strings
const initial = {
  searchTracks: [],
  current: '',
  playlist: []
}
function playlistReducer (state, action){
  state = state || initial;
  switch (action.type){
  	case actions.SEARCH_RESULTS:
  		return _.extend({}, state, {
        searchTracks: action.payload
      });
    case actions.PLAY_SONG:
  		return _.extend({}, state, {
        current: action.payload
      });
    case actions.ADD_SONG:
  		var state = _.extend({}, state, {});
  		console.log(action.payload)
  		state.playlist.push(action.payload);
  		return state;
    default:
      return state;
  }
};

module.exports = playlistReducer;
