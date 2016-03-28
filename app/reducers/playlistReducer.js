'use strict';
import {actions} from '../constants'
var _ = require('lodash');
//view strings
const initial = {
  tracks: [],
  current: ''
}
function playlistReducer (state, action){
  state = state || initial;
  switch (action.type){
  	case actions.SEARCH_RESULTS:
  		return _.extend({}, state, {
        tracks: action.payload
      });
    case actions.PLAY_SONG:
  		return _.extend({}, state, {
        current: action.payload
      });
    default:
      return state;
  }
};

module.exports = playlistReducer;
