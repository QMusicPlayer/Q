var db = require('./dbConfig');
var Room = require('./roomModel');
var User = db.Model.extend({
  tableName: 'users',
  hostRoom: function() {
    return this.belongsTo(Room, 'name');
  }
});
 

module.exports = User;
