var db = require('./dbConfig');
var User = require('./userModel');
var Room = db.Model.extend({
  tableName: 'rooms',
  host: function() {
    return this.belongsTo(User, 'user_id');
  },
  guests: function() {
    return this.belongsToMany(User, 'id');
  }
});
module.exports = Room;
