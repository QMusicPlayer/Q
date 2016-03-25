'use strict';
import {actions} from '../constants'
var _ = require('lodash');
//view strings
const initial = {
  tracks: []
}
function playlistReducer (state, action){
  state = state || initial;
  switch (action.type){
  	case actions.SEARCH_RESULTS:
  	console.log(action.payload)
  		return _.extend({}, state, {
        tracks: action.payload,
      });
    default:
      return state;
  }
};

module.exports = playlistReducer;
