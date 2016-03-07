'use strict';

var _ = require('lodash');
//view strings
var views = require('../constants').view

function viewReducer (state, action){
  state = state || views.PLAYLIST;
  switch (action.type){
    default:
      return state;
  }
};

module.exports = viewReducer;
