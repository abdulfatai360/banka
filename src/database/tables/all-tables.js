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
    console.log('Tables creation error: ', err.message);
  }
};

const tablesDown = async () => {
  try {
    await db.query(dropAllTables);
  } catch (err) {
    console.log('Tables drop error: ', err.message);
  }
};

export { tablesUp, tablesDown };
require('make-runnable');
