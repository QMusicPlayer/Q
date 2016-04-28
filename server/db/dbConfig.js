var knex;

if (process.env.DEPLOYED) {
  knex = require('knex')({
    client: 'pg',
    connection: {
      host: 'postgres',
      user: 'postgres',
      password: 'mysecretpassword',
      database : 'postgres',
      charset  : 'utf8'
    }
  });
} else {
  knex = require('knex')({
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'q',
      password:'root',
      charset: 'utf8'
    }
  });
}

var db = require('bookshelf')(knex);

var createUsersTable = function () {
  return db.knex.schema.createTable('users', function (user) {
    user.increments('id').primary();
    user.string('socketId', 255)
    user.string('hostRoom').unsigned().references('rooms.name');
    user.string('guestRoom').unsigned().references('rooms.name');
    user.timestamps();
  }).then(function (table) {
    console.log('Created user Table');
  });
};

var createRoomsTable = function () {
  return db.knex.schema.createTable('rooms', function (room) {
    room.increments('id').primary();
    room.string('name', 255).unique();
    room.json('location');
    room.integer('userCount');
    room.specificType('queue', 'json[]');
    room.timestamps();
  }).then(function (table) {
    console.log('Created room Table');
  });
};

db.knex.schema.hasTable('rooms').then(function(exists) {
  if (!exists) {
    createRoomsTable();
  }
});
// Create challenges table with id, name, prompt, and test_suite
db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    createUsersTable();
  }
});

// Create challenges table with id, user_id, opponent_id, win


module.exports = db;
