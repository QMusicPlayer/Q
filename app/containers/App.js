//react & redux require
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';

//actions require
import {actions}   from '../actions';
import {Playlist} from '../components/Playlist.js'

//constant requires (views)
import {view} from '../constants';

var contextType = {
  redux: React.PropTypes.object
};

class App extends React.Component{
  render() {
      switch(this.props.view) {
        case view.STAGING:
          return (
            <div>
              <components.Staging {...this.props}/>
            </div>
          );
        case view.PLAYLIST:
          return (
            <div>
              <Playlist/>
            </div>
          );
        
      }

    }
}

function mapStateToProps(state) {
    // instantiate empty object
    // keys currently are: user, view, newRace, activeRace
    var mapping = {};

    for (var k in state){
      mapping[k] = state[k];
    }

  return mapping;
}

function mapDispatchToProps(dispatch) {
  // console.log("THE MAPPED ACTIONS", actions);
  var actionsObj = {}
  for(var key in actions) {
    actionsObj[key] = bindActionCreators(actions[key], dispatch);
  }
  return actionsObj;
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
