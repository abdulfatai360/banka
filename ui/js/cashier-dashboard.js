/* ******** fetch transactions cashier has consummated ******** */
const cashierTransactionsTemplate = document.querySelector('#cashier-transactions-template').textContent;

const generateCashierTransactionsHtml = (template, txnEntity) => {
  let txnTemplate = template;

  const createdOn = new Date(txnEntity.createdOn);
  const date = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(createdOn);
  const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(createdOn);

  txnTemplate = txnTemplate.replace('{{date}}', date);
  txnTemplate = txnTemplate.replace('{{time}}', time);
  txnTemplate = txnTemplate.replace('{{type}}', txnEntity.transactionType);
  txnTemplate = txnTemplate.replace('{{accountNumber}}', txnEntity.accountNumber);
  txnTemplate = txnTemplate.replace('{{amount}}', txnEntity.amount);

  return txnTemplate;
};

const renderCashierTransactions = (transactions) => {
  const cashierTransactionsElem = document.querySelector('.cashier-transactions tbody');
  let cashierTransactionsHtml = '';

  transactions.forEach(transaction => {
    cashierTransactionsHtml += generateCashierTransactionsHtml(cashierTransactionsTemplate, transaction);
  })

  cashierTransactionsElem.innerHTML = cashierTransactionsHtml;
};

const getCashierTransactions = () => {
  const token =JSON.parse(localStorage.getItem('token'));
  const cashierTransactionsElem = document.querySelector('.cashier-transactions tbody');
  const httpMessageElem = document.querySelector('.http-message');

  // const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/user/transactions';
  const url = 'http://localhost:3000/api/v1/user/transactions';
  const init = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-auth-token": token
    }
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      cashierTransactionsElem.textContent = '';
      httpMessageElem.textContent = '';
      document.querySelector('.cashier-transactions__inner')
        .classList.remove('state--loading');

      if (response.status !== 200) {
        const cashierTransactionsElemSpan = document.createElement('span');
        cashierTransactionsElemSpan.textContent = response.error;
        httpMessageElem.appendChild(cashierTransactionsElemSpan);
        return false;
      }

      if (response.message) {
        const cashierTransactionsElemSpan = document.createElement('span');
        cashierTransactionsElemSpan.textContent = response.message;
        httpMessageElem.appendChild(cashierTransactionsElemSpan);
        return true;
      }

      document.querySelector('.cashier-transactions__inner').classList.remove('state--no-data');

      renderCashierTransactions(response.data);
    })
    .catch(error => console.log(error.message));
};

getCashierTransactions();

/* ******** new transaction consummation by cashier ******** */
const txnPostingForm = document.querySelector('.post-transaction-form');
const successMessageTemplate = document.querySelector('#success-popup-template').textContent;
const errorMessageTemplate = document.querySelector('#failure-popup-template').textContent;
const validationErrorTemplate = document.querySelector('#validation-error-list-template').textContent;
const validationErrors = {};

const showMessage = (message, messageType) => {
  const submitButtonField = document.querySelector('.submit-btn-field');
  const popupElem = document.querySelector('.popup');
  let htmlString;

  if (messageType === 'success') {
    const messageTemplate = successMessageTemplate;
    htmlString = messageTemplate.replace('{{message}}', message);
  } else {
    const messageTemplate = errorMessageTemplate;
    htmlString = messageTemplate.replace('{{message}}', message);
  }

  popupElem.textContent = '';
  popupElem.innerHTML = htmlString;
  popupElem.parentElement.classList.add('popup--visible');
  setTimeout(() => {
    popupElem.parentElement.classList.remove('popup--visible');
    submitButtonField.classList.remove('btn__loading-icon-visible');
  }, 3000);
};

const renderValidationError = (errors, inputField, errorsListElem) => {
  const errorTemplate = validationErrorTemplate
  let errorHtml = '';
  const errorMessages = errors;

  errorMessages.forEach(errorMessage => {
    errorHtml += errorTemplate.replace('{{message}}', errorMessage);
  });

  errorsListElem.innerHTML = errorHtml;
  inputField.classList.add('input-not-validated');
};

const resetTxnPostingForm = () => {
  const errsListElems = document.querySelectorAll('.form-field .validation-error-list');
  const txnPostingInputs = [
    txnPostingForm.accountNumber,
    txnPostingForm.amount,
    txnPostingForm.txnType
  ];

  txnPostingInputs.forEach(input => input.classList.remove('input-not-validated'));
  errsListElems.forEach(errListElem => errListElem.textContent = '');
};

class validateTxnPostingInputs {
  static accountNumber(errors) {
    const errorsListElem = document.querySelector('.account-number-field .validation-error-list');
    errorsListElem.textContent = '';

    validationErrors.accountNumber = errors.filter((error) => {
      return /^account number/i.test(error);
    });

    if (!txnPostingForm.accountNumber.value) {
      validationErrors.accountNumber.push('Account number should not be empty')
    }

    if (validationErrors.accountNumber.length) {
      return renderValidationError(validationErrors.accountNumber, txnPostingForm.accountNumber, errorsListElem);
    }

    txnPostingForm.accountNumber.classList.remove('input-not-validated');
  }

  static amount(errors) {
    const errorsListElem = document.querySelector('.amount-field .validation-error-list');
    errorsListElem.textContent = '';

    validationErrors.amount = errors.filter((error) => {
      return /^amount/i.test(error);
    });

    if (validationErrors.amount.length) {
      return renderValidationError(validationErrors.amount, txnPostingForm.amount, errorsListElem);
    }

    txnPostingForm.amount.classList.remove('input-not-validated');
  }

  static transactionType(errors) {
    const errorsListElem = document.querySelector('.txn-type-field .validation-error-list');
    errorsListElem.textContent = '';

    validationErrors.transactionType = errors.filter((error) => {
      return /^transaction type/i.test(error);
    });

    if (validationErrors.transactionType.length) {
      return renderValidationError(validationErrors.transactionType, txnPostingForm.txnType, errorsListElem);
    }

    txnPostingForm.txnType.classList.remove('input-not-validated');
  }
}

const postTransaction = (newTransactionInfo) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const submitButtonField = document.querySelector('.submit-btn-field');
  const accountNumber = newTransactionInfo.accountNumber || '0000000000';
  const transactionType = newTransactionInfo.transactionType || 'credit';
  const url = `https://ile-ifowopamo.herokuapp.com/api/v1/transactions/${accountNumber}/${transactionType.toLowerCase()}`;

  // const url = `http://localhost:3000/api/v1/transactions/${accountNumber}/${transactionType.toLowerCase()}`;
  const init = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-auth-token": token,
    },
    method: 'POST',
    body: JSON.stringify(newTransactionInfo),
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      submitButtonField.classList.remove('btn__loading-icon-visible');

      if (response.status === 422) {
        const { errors } = response;
        validateTxnPostingInputs.accountNumber(errors);
        validateTxnPostingInputs.amount(errors);
        validateTxnPostingInputs.transactionType(errors);

        console.log('There are validation errors you need to fix');
        return false;
      }
      
      resetTxnPostingForm();

      if (response.message) {
        showMessage(response.message, 'success');
        return false;
      }

      if (response.status !== 201) {
        showMessage(response.error, 'failure');
        return false;
      }

      showMessage('Transaction successful', 'success');
      getCashierTransactions();
      setTimeout(() => {
        txnPostingForm.reset();
      }, 3000);
    })
    .catch(error => {
      submitButtonField.classList.remove('btn__loading-icon-visible');
      console.log(error.message);
    })
};

/* ******** post transaction on form submission ******** */
txnPostingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const submitButtonField = document.querySelector('.submit-btn-field');
  submitButtonField.classList.add('btn__loading-icon-visible');

  postTransaction({
    accountNumber: txnPostingForm.accountNumber.value,
    amount: txnPostingForm.amount.value,
    transactionType: txnPostingForm.txnType.value,
  });
});
