var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
	name: String,
	socketRoomName: String,
	host: String,
	guests: [],
    userCount: Number,
    queue: [],
}, { timestamps: true });

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
