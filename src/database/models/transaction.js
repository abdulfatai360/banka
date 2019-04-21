import Model from './model';
import removeProp from '../../utilities/remove-object-prop';

class Transaction extends Model {
  // eslint-disable-next-line no-useless-constructor
  constructor(tableName) {
    super(tableName);
  }

  async create(data) {
    const rows = await Model.prototype.create.call(this, data);

    rows[0] = removeProp('created_on', rows[0]);
    rows[0] = removeProp('old_balance', rows[0]);

    return rows;
  }
}

export default new Transaction('transaction');
