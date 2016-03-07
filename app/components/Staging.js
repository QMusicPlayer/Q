var React = require('react');

var Staging = React.createClass({
  render: function() {
    return (
      <div>
        <form>
          Create Room: <input type="text" name="createRoom"></input>
          Enter Room: <input type="text" name="enterRoom"></input>
        </form>
      </div>
    )
  }
});

module.exports = Staging;
