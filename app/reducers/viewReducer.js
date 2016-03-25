'use strict';

var _ = require('lodash');
//view strings
import {views} from '../constants'

function viewReducer (state, action){
  state = state || views.PLAYLIST;
  switch (action.type){
    default:
      return state;
  }
};

module.exports = viewReducer;
