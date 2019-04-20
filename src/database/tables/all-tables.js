import db from '..';
import * as userTable from './user-table';
import * as accountTable from './account-table';

const createAllTables = `
  ${userTable.createTable}
  ${accountTable.createTable}
`;

const dropAllTables = `
  ${userTable.dropTable}
  ${accountTable.dropTable}
`;

const tablesUp = async () => {
  try {
    await db.query(createAllTables);
  } catch (err) {
    console.log('Create-All-Tables-Error: ', err.message);
  }
};

const tablesDown = async () => {
  try {
    await db.query(dropAllTables);
  } catch (err) {
    console.log('Drop-All-Tables-Error: ', err.message);
  }
};

export { tablesUp, tablesDown };
require('make-runnable');
