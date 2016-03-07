'use strict';
var combineReducers = require('redux').combineReducers;


var reducers = {
  view: require('./viewReducer.js')
}

module.exports = combineReducers(reducers);
