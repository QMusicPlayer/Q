var db = require('./dbConfig');
db.plugin('registry');
var User = require('./userModel');
var Room = db.Model.extend({
  tableName: 'rooms',
  host: function() {
    return this.hasOne('User', 'socketId');
  },
  guests: function() {
    return this.hasMany('User', 'socketId');
  }
});
module.exports = db.model('Room', Room);;
