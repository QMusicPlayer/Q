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

var createRoomsTable = function () {
  return db.knex.schema.createTable('rooms', function (room) {
    room.increments('id').primary();
    room.string('host');
    room.string('name', 255).unique();
    room.integer('votesToSkip');
    room.json('location');
    room.integer('userCount');
    room.specificType('queue', 'json[]');
    room.timestamps();
  }).then(function (table) {
    console.log('Created room Table');
  });
};

var createUsersTable = function () {
  return db.knex.schema.createTable('users', function (user) {
    user.increments('id').primary();
    user.string('socketId', 255);
    user.string('hostRoom').unsigned().references('name').inTable('rooms');
    user.string('guestRoom').unsigned().references('name').inTable('rooms');
    user.specificType('votes', 'json[]');
    user.boolean('skipVotes');
    user.timestamps();
  }).then(function (table) {
    console.log('Created user Table');
  });
};



db.knex.schema.hasTable('rooms').then(function(exists) {
  if (!exists) {
    createRoomsTable();
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    createUsersTable();
  }
});

var resetUsersTable = function () {
  return db.knex.schema.dropTable('users').then(createUsersTable);
};

var resetRoomsTable = function () {
  return db.knex.schema.dropTable('rooms').then(createRoomsTable);
};

var resetRoomsAndUsersTable = function () {
  return db.knex.schema.dropTable('users').then(function () {
    return db.knex.schema.dropTable('rooms').then(function () {
      createRoomsTable();
      createUsersTable();
      
    })
  })
}


db.resetEverything = function (req, res) {
  resetRoomsAndUsersTable().then(function() {
    res.status(201).end();
  });
};

db.resetEverythingPromise = function () {
  return resetRoomsAndUsersTable().then(function() {
  }).catch(function(e) {
    console.log(e);
  });
};


module.exports = db;
