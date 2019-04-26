import db from '..';
import seedUsersTable from '../seeders/seed-users';
import * as userTable from './user-table';
import * as accountTable from './account-table';
import * as transactionTable from './transaction-table';

const createAllTablesQuery = `
  ${userTable.createTable}
  ${accountTable.createTable}
  ${transactionTable.createTable}
`;

const dropAllTablesQuery = `
  ${userTable.dropTable}
  ${accountTable.dropTable}
  ${transactionTable.dropTable}
`;

const createAllTables = async () => {
  await db.query(createAllTablesQuery);
};

const dropAllTables = async () => {
  await db.query(dropAllTablesQuery);
};

export { createAllTables, dropAllTables, seedUsersTable };
require('make-runnable');
