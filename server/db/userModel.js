var db = require('./dbConfig');
db.plugin('registry')
var Room = require('./roomModel');
var User = db.Model.extend({
  tableName: 'users',
  hostRoom: function() {
    return this.belongsTo('Room', 'name');
  },
  guestRoom: function () {
  	return this.belongsTo('Room', 'name')
  }
});
 

module.exports = db.model('User', User);;
