/* ******** populate user account overview section ******** */
const accountsOverviewTemplate = document.querySelector('#accounts-overview-template').textContent;
const token = JSON.parse(localStorage.getItem('token'));

const generateAccountsOverviewHtml = (template, accountEntity) => {
  let acctTemplate = template;
  const acctOwner = JSON.parse(localStorage.getItem('user'));

  acctTemplate = acctTemplate.replace('{{accountName}}', `${acctOwner.firstName} ${acctOwner.lastName}`);
  acctTemplate = acctTemplate.replace('{{accountType}}', accountEntity.accountType);
  acctTemplate = acctTemplate.replace('{{accountNumber}}', accountEntity.accountNumber);
  acctTemplate = acctTemplate.replace('{{accountBalance}}', accountEntity.balance);

  return acctTemplate;
};

const renderAccountsOverview = (accounts) => {
  const accountsOverviewElem = document.querySelector('.accounts-overview__list');
  let accountsOverviewHtml = '';

  accounts.forEach(account => {
    accountsOverviewHtml += generateAccountsOverviewHtml(accountsOverviewTemplate, account);
  })

  accountsOverviewElem.innerHTML = accountsOverviewHtml;
};

const fetchUserAccounts = () => {
  const accountsOverviewElem = document.querySelector('.accounts-overview__list');

  const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/user/accounts';
  const init = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-auth-token": token
    }
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      // console.log(response);
      accountsOverviewElem.textContent = '';

      if (response.status !== 200) {
        const accountsOverviewElemSpan = document.createElement('span');
        accountsOverviewElemSpan.textContent = response.error;
        accountsOverviewElem.appendChild(accountsOverviewElemSpan);
        return false;
      }

      if (response.message) {
        const accountsOverviewElemSpan = document.createElement('span');
        accountsOverviewElemSpan.style.fontStyle = 'italic';
        accountsOverviewElemSpan.textContent = response.message;
        accountsOverviewElem.appendChild(accountsOverviewElemSpan);
        return true;
      }

      renderAccountsOverview(response.data);
      accountsOverviewElem.parentElement.classList.remove('state--no-data');
    })
    .catch(error => console.log(error.message));
};

fetchUserAccounts();

/* ******** populate user transaction overview section ******** */
const transactionsOverviewTemplate = document.querySelector('#transactions-overview-template').textContent;

const generateTransactionsOverviewHtml = (template, transactionEntity) => {
  let txnTemplate = template;
  const createdOn = new Date(transactionEntity.createdOn);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short'}).format(createdOn);
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(createdOn);
  const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(createdOn);

  txnTemplate = txnTemplate.replace('{{month}}', month);
  txnTemplate = txnTemplate.replace('{{day}}', createdOn.getDate());
  txnTemplate = txnTemplate.replace('{{year}}', year);
  txnTemplate = txnTemplate.replace('{{type}}', transactionEntity.transactionType.toLowerCase());
  txnTemplate = txnTemplate.replace('{{amount}}', transactionEntity.amount);
  txnTemplate = txnTemplate.replace('{{time}}', time);
  txnTemplate = txnTemplate.replace('{{balance}}', transactionEntity.newBalance);

  return txnTemplate;
};

const renderTransactionsOverview = (transactions) => {
  const transactionsOverviewElem = document.querySelector('.transactions-overview tbody');
  let transactionsOverviewHtml = '';

  transactions.forEach(transaction => {
    transactionsOverviewHtml += generateTransactionsOverviewHtml(transactionsOverviewTemplate, transaction);
  })

  transactionsOverviewElem.innerHTML = transactionsOverviewHtml;
};

const fetchUserTransactions = () => {
  const transactionsOverviewElem = document.querySelector('.transactions-overview tbody');

  const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/user/transactions';
  const init = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-auth-token": token
    }
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      // console.log(response);
      transactionsOverviewElem.textContent = '';
      document.querySelector('.transactions-overview .default').style.display = 'none';

      if (response.status !== 200) {
        const transactionsOverviewElemSpan = document.createElement('span');
        transactionsOverviewElemSpan.textContent = response.error;
        transactionsOverviewElem.appendChild(transactionsOverviewElemSpan);
        return true;
      }

      if (response.message) {
        const transactionsOverviewElemSpan = document.createElement('span');
        transactionsOverviewElemSpan.style.fontStyle = 'italic';
        transactionsOverviewElemSpan.style.fontSize = '1.1em';
        transactionsOverviewElemSpan.textContent = response.message;
        transactionsOverviewElem.appendChild(transactionsOverviewElemSpan);
        return true;
      }

      renderTransactionsOverview(response.data);
      document.querySelector('.transactions-overview__inner').classList.remove('state--no-data');
    })
    .catch(error => console.log(error.message));
};

fetchUserTransactions();

