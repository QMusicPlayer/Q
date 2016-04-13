var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  id: String
}, { timestamps: true });

var User = mongoose.model('User', userSchema);

module.exports = User;
