const transactionDetailsTemplate = document.querySelector('#transaction-details-template').textContent;

const generateTransactionDetailsHtml = (template, transactionEntity) => {
  let transactionTemplate = template;
  let date = new Date(transactionEntity.createdOn);
  const dateFormat = { day: 'numeric', month: 'numeric', year: 'numeric' };

  date = new Intl.DateTimeFormat('en-US', dateFormat).format(date);

  transactionTemplate = transactionTemplate.replace(/{{type}}/g, transactionEntity.transactionType);
  transactionTemplate = transactionTemplate.replace('{{date}}', date);
  transactionTemplate = transactionTemplate.replace('{{accountNumber}}', transactionEntity.accountNumber);
  transactionTemplate = transactionTemplate.replace('{{amount}}', transactionEntity.amount);
  transactionTemplate = transactionTemplate.replace('{{oldBalance}}', transactionEntity.oldBalance);
  transactionTemplate = transactionTemplate.replace('{{newBalance}}', transactionEntity.newBalance);

  return transactionTemplate;
};

const renderTransactionDetails = (transactions) => {
  const transactionDetailsElem = document.querySelector('.transaction-details tbody');
  let transactionDetailsHtml = '';

  transactions.forEach(transaction => {
    transactionDetailsHtml += generateTransactionDetailsHtml(transactionDetailsTemplate, transaction);
  })

  transactionDetailsElem.innerHTML = transactionDetailsHtml;
};

const fetchTransactions = (url) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const transactionDetailsElem = document.querySelector('.transaction-details tbody');

  const init = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-auth-token": token
    }
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      transactionDetailsElem.textContent = '';
      document.querySelector('.http-message').textContent = '';
      document.querySelector('.transaction-details__inner')
        .classList.remove('state--loading');

      if (response.status !== 200) {
        const transactionDetailsElemSpan = document.createElement('span');
        transactionDetailsElemSpan.textContent = response.error;
        document.querySelector('.http-message')
          .appendChild(transactionDetailsElemSpan);
        return false;
      }

      if (response.message) {
        const transactionDetailsElemSpan = document.createElement('span');
        transactionDetailsElemSpan.textContent = response.message;
        document.querySelector('.http-message')
          .appendChild(transactionDetailsElemSpan);
        return true;
      }

      document.querySelector('.transaction-details__inner')
        .classList.remove('state--no-data');

      renderTransactionDetails(response.data);
    })
    .catch(error => console.log(error.message));
};

/* ******** fetch all transactions ******** */
const allTransactions = () => {
  const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/user/transactions';
  // const url = 'http://localhost:3000/api/v1/user/transactions';
  fetchTransactions(url);
};

allTransactions();

/* ******** fetch specific transactions ******** */
const getClientAccountNumbers = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/user/accounts';
  // const url = 'http://localhost:3000/api/v1/user/accounts';
  const init = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-auth-token": token
    }
  };

  return new Promise((resolve, reject) => {
    fetch(url, init)
      .then(response => response.json())
      .then((response) => {
        let accountNumbers = ['-- Select bank account --'];

        if (response.data) {
          response.data.forEach(accountEntity => {
            accountNumbers.push(accountEntity.accountNumber)
          });
        }
        resolve(accountNumbers);
      })
      .catch(error => console.log(error.message));
  });  
};

const populateAccountSelectElem = () => {
  const accountSelectElem = document.querySelector('.select-account');
  getClientAccountNumbers()
    .then(accountNumbers => {
      accountNumbers.forEach(accountNumber => {
        const accountSelectOptionElem = document.createElement('option');
        accountSelectOptionElem.text = accountNumber;
        accountSelectElem.add(accountSelectOptionElem, null);
      })
    })
};

const oneAccountTransactions = () => {
  const accountSelectElem = document.querySelector('.select-account');
  const selectedAccountNumber = accountSelectElem.value;

  document.querySelector('.transaction-details__inner')
    .classList.add('state--no-data');
  document.querySelector('.transaction-details__inner')
    .classList.add('state--loading');
  document.querySelector('.http-message').textContent = '';
  document.querySelector('.transaction-details tbody').textContent = '';

  if (/-- Select bank account --/i.test(selectedAccountNumber)) {
    allTransactions();
    return true;
  }

  const url = `https://ile-ifowopamo.herokuapp.com/api/v1/user/transactions/${selectedAccountNumber}`;
  // const url = `http://localhost:3000/api/v1/user/transactions/${selectedAccountNumber}`;

  fetchTransactions(url);
};

populateAccountSelectElem();

const accountSelectSubmitButton = document.querySelector('.btn-form');
accountSelectSubmitButton.addEventListener('click', oneAccountTransactions);
