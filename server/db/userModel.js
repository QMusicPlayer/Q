var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	socketId: String,
    rooms: []
}, { timestamps: true });

var User = mongoose.model('User', userSchema);

module.exports = User;
