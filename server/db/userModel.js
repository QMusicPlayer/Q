var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    userCount: Number,
    queue: [],
    hash: {
      type: String,
      index: {unique: true}
    }
}, { timestamps: true });

var User = mongoose.model('User', userSchema);

module.exports = User;
