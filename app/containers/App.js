//react & redux require
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
//actions require
import {actions}   from '../actions';
import {components} from '../components/'

//constant requires (views)
import {views} from '../constants';

var contextType = {
  redux: React.PropTypes.object
};

class App extends React.Component{
  render() {
      switch(this.props.view) {
        case views.PLAYLIST:
          return (
            <div>
              <components.Playlist {...this.props}/>
            </div>
          );
        
      }

    }
}

const mapStateToProps = (state) => {
    // instantiate empty object
    var mapping = {};

    for (var k in state){
      mapping[k] = state[k];
    }

  return mapping;
}

const mapDispatchToProps = (dispatch) => {
  // console.log("THE MAPPED ACTIONS", actions);
  var actionsObj = {}
  for(var key in actions) {
    actionsObj[key] = bindActionCreators(actions[key], dispatch);
  }
  return actionsObj;
}
injectTapEventPlugin();
module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
