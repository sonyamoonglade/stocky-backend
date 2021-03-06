/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('sessions',{
    session_id: {
      type:'varchar(500)',
      unique: true
    },
    user_id: {
      type: 'int',
      references: '"users"',
      notNull: true,
      onDelete: 'Cascade'
    },
    username: {
      type: 'varchar(255)',
      notNull: true
    },
    ttl: {
      type: 'varchar(255)',
      notNull: true
    },
  })
  pgm.createIndex('sessions','user_id')
};

exports.down = pgm => {
  pgm.dropConstraint('sessions','sessions_user_id_fkey')
  pgm.dropTable('sessions')

};

