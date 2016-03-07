'use strict';

var createStore = require('redux').createStore;
var applyMiddleware = require('redux').applyMiddleware;
var thunk = require('redux-thunk');
var reducer = require('../reducers');


var createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

function configureStore(initialState) {
  var store = createStoreWithMiddleware(reducer, initialState)
  return store;
}

module.exports = configureStore;
