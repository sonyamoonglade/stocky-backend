/* eslint-disable camelcase */

exports.shorthands = undefined;


exports.up = pgm => {
  pgm.createTable('broker_accounts',{
    id:{
      type:'id',
      autoIncrement: true,
    },
    user_id: {
      type:'int',
      references:'"users"',
      onDelete:'cascade',
      notNull: true
    },
    name: {
      type: 'varchar(255)',
      notNull: true
    },
    asset_quantity:{
      type:'numeric',
      default: 0
    },
    currency_type: {
      type: 'varchar(100)',
      notNull: true
    },
    balance: {
      type:'numeric',
      notNull: true,
      default: 0
    },
    assets: {
      type: ''
    }
  })
  pgm.createIndex('broker_accounts','user_id')
};

exports.down = pgm => {
  pgm.dropConstraint('broker_accounts','broker_accounts_user_id_fkey')
  pgm.dropTable('broker_accounts')

};
