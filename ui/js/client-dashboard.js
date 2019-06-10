/* ******** populate user account overview section ******** */
const accountsOverviewTemplate = document.querySelector(
  '#accounts-overview-template'
).textContent;
const token = JSON.parse(localStorage.getItem('token'));

const generateAccountsOverviewHtml = (template, accountEntity) => {
  let acctTemplate = template;
  const acctOwner = JSON.parse(localStorage.getItem('user'));

  acctTemplate = acctTemplate.replace(
    '{{accountName}}',
    `${acctOwner.firstName} ${acctOwner.lastName}`
  );
  acctTemplate = acctTemplate.replace(
    '{{accountType}}',
    accountEntity.accountType
  );
  acctTemplate = acctTemplate.replace(
    '{{accountNumber}}',
    accountEntity.accountNumber
  );
  acctTemplate = acctTemplate.replace(
    '{{accountBalance}}',
    accountEntity.balance
  );

  return acctTemplate;
};

const renderAccountsOverview = accounts => {
  const accountsOverviewElem = document.querySelector(
    '.accounts-overview__list'
  );
  let accountsOverviewHtml = '';

  accounts.forEach(account => {
    accountsOverviewHtml += generateAccountsOverviewHtml(
      accountsOverviewTemplate,
      account
    );
  });

  accountsOverviewElem.innerHTML = accountsOverviewHtml;
};

const fetchUserAccounts = () => {
  const accountsOverviewElem = document.querySelector(
    '.accounts-overview__list'
  );

  const url = `${appUrl}/user/accounts`;
  const init = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': token
    }
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      accountsOverviewElem.textContent = '';
      document.querySelector('.accounts-overview .http-message').textContent =
        '';
      document
        .querySelector('.accounts-overview__inner')
        .classList.remove('state--loading');

      if (response.status !== 200) {
        const accountsOverviewElemSpan = document.createElement('span');
        accountsOverviewElemSpan.textContent = response.error;
        document
          .querySelector('.accounts-overview .http-message')
          .appendChild(accountsOverviewElemSpan);
        return false;
      }

      if (response.message) {
        const accountsOverviewElemSpan = document.createElement('span');
        accountsOverviewElemSpan.textContent = response.message;
        document
          .querySelector('.accounts-overview .http-message')
          .appendChild(accountsOverviewElemSpan);
        return true;
      }

      accountsOverviewElem.parentElement.classList.remove('state--no-data');
      renderAccountsOverview(response.data);
    })
    .catch(error => console.log(error.message));
};

fetchUserAccounts();

/* ******** populate user transaction overview section ******** */
const transactionsOverviewTemplate = document.querySelector(
  '#transactions-overview-template'
).textContent;

const generateTransactionsOverviewHtml = (template, transactionEntity) => {
  let txnTemplate = template;
  const createdOn = new Date(transactionEntity.createdOn);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
    createdOn
  );
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(
    createdOn
  );
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(createdOn);

  txnTemplate = txnTemplate.replace('{{month}}', month);
  txnTemplate = txnTemplate.replace('{{day}}', createdOn.getDate());
  txnTemplate = txnTemplate.replace('{{year}}', year);
  txnTemplate = txnTemplate.replace(
    '{{type}}',
    transactionEntity.transactionType.toLowerCase()
  );
  txnTemplate = txnTemplate.replace('{{amount}}', transactionEntity.amount);
  txnTemplate = txnTemplate.replace('{{time}}', time);
  txnTemplate = txnTemplate.replace(
    '{{balance}}',
    transactionEntity.newBalance
  );

  return txnTemplate;
};

const renderTransactionsOverview = transactions => {
  const transactionsOverviewElem = document.querySelector(
    '.transactions-overview tbody'
  );
  let transactionsOverviewHtml = '';

  transactions.forEach(transaction => {
    transactionsOverviewHtml += generateTransactionsOverviewHtml(
      transactionsOverviewTemplate,
      transaction
    );
  });

  transactionsOverviewElem.innerHTML = transactionsOverviewHtml;
};

const fetchUserTransactions = () => {
  const transactionsOverviewElem = document.querySelector(
    '.transactions-overview tbody'
  );

  const url = `${appUrl}/user/transactions`;
  const init = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': token
    }
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      transactionsOverviewElem.textContent = '';
      document.querySelector(
        '.transactions-overview .http-message'
      ).textContent = '';
      document
        .querySelector('.transactions-overview__inner')
        .classList.remove('state--loading');

      if (response.status !== 200) {
        const transactionsOverviewElemSpan = document.createElement('span');
        transactionsOverviewElemSpan.textContent = response.error;
        document
          .querySelector('.transactions-overview .http-message')
          .appendChild(transactionsOverviewElemSpan);
        return false;
      }

      if (response.message) {
        const transactionsOverviewElemSpan = document.createElement('span');
        transactionsOverviewElemSpan.textContent = response.message;
        document
          .querySelector('.transactions-overview .http-message')
          .appendChild(transactionsOverviewElemSpan);
        return true;
      }

      document
        .querySelector('.transactions-overview__inner')
        .classList.remove('state--no-data');
      renderTransactionsOverview(response.data);
    })
    .catch(error => console.log(error.message));
};

fetchUserTransactions();
