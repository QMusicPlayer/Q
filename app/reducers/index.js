'use strict';
var combineReducers = require('redux').combineReducers;


var reducers = {
  view: require('./viewReducer.js'),
  playlist: require('./playlistReducer.js')
}

module.exports = combineReducers(reducers);
