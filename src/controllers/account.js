/* eslint-disable consistent-return */
import { userModel } from '../models/user';
import { accountModel } from '../models/account';
import HttpResponse from '../utilities/http-response';

const accountData = (req) => {
  // default values
  const status = 'draft'; const openingBalance = 0;

  return {
    owner: Number(req.body.owner),
    type: req.body.type,
    status,
    openingBalance,
    balance: openingBalance,
  };
};

const accountController = {
  create(req, res) {
    const accountOwner = userModel.findById(Number(req.body.owner));

    if (!accountOwner) {
      return HttpResponse.send(res, 400, {
        error: 'The client you tried to open an account for does not exist',
      });
    }

    const accountInfo = accountModel.create(accountData(req));

    return HttpResponse.send(res, 201, {
      data: {
        accountNumber: accountInfo.accountNumber,
        firstName: accountOwner.firstName,
        lastName: accountOwner.lastName,
        otherName: accountOwner.otherName,
        email: accountOwner.email,
        type: accountInfo.type,
        openingBalance: accountInfo.openingBalance,
      },
    });
  },

  changeStatus(req, res) {
    const { accountNumber } = req.params;
    const newStatus = req.body.status;
    const account = accountModel.findByAccountNumber(accountNumber);

    if (!account) {
      return HttpResponse.send(res, 400, { error: 'The account you entered is incorrect' });
    }

    account.status = newStatus;
    return HttpResponse.send(res, 200, {
      data: { accountNumber, status: account.status },
    });
  },

  delete(req, res) {
    const { accountNumber } = req.params;
    const account = accountModel.findByAccountNumber(accountNumber);

    if (!account) {
      return HttpResponse.send(res, 400, {
        error: 'The account you wanted to delete is invalid',
      });
    }

    accountModel.deleteOne({ accountNumber });
    return HttpResponse.send(res, 200, { message: 'Account successfully deleted' });
  },
};

export default accountController;
