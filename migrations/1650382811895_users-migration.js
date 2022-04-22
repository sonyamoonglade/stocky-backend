/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: {
      type:'id',
      autoIncrement: true,
    },
    email:{
      type:'varchar(255)',
      notNull: true,
      unique: true,
    },
    firstname:{
      type:'varchar(255)',
      notNull: true,
    },
    lastname:{
      type:'varchar(255)',
      notNull: true
    },
    password:{
      type:'varchar(255)',
      notNull: true
    },
    passwordHint:{
      type:'varchar(255)',
      default: ''
    },
    hasBrokerAccount:{
      type:'boolean',
      default: false
    },
    dollarBalance:{
      type:'numeric',
      default: 0
    },
    rubBalance:{
      type:'numeric',
      default: 0
    },
    euroBalance:{
      type:'numeric',
      default: 0
    },
    subscribedToNotifications:{
      type:'boolean',
      default: false
    },
    dataOfBirth:{
      type:'string',
      notNull: true
    }
  })
};

exports.down = pgm => {
  pgm.dropTable('users')
};
