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
    password_hint:{
      type:'varchar(255)',
      default: ''
    },
    has_broker_account:{
      type:'boolean',
      default: false
    },
    subscribed_to_notifications:{
      type:'boolean',
      default: false
    },
    date_of_birth:{
      type:'string',
      notNull: true
    }
  })
};

exports.down = pgm => {


  pgm.dropTable('users', {
    cascade: true
  })

};
