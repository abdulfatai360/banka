/* ******** global variables ******** */
const accountsListTemplate = document.querySelector('#bank-accts-ls-template')
  .textContent;

/* ******** generates accounts list from the template ******** */
const generateAccountsListHtml = (template, accountEntity) => {
  let accountTemplate = template;

  let createdOn = new Date(accountEntity.createdOn);
  createdOn = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(createdOn);

  accountTemplate = accountTemplate.replace('{{createdOn}}', createdOn);
  accountTemplate = accountTemplate.replace(
    '{{accountNumber}}',
    accountEntity.accountNumber
  );
  accountTemplate = accountTemplate.replace(
    '{{type}}',
    accountEntity.accountType
  );
  accountTemplate = accountTemplate.replace(
    '{{status}}',
    accountEntity.accountStatus
  );
  accountTemplate = accountTemplate.replace(
    '{{openingBalance}}',
    accountEntity.openingBalance
  );
  accountTemplate = accountTemplate.replace(
    '{{balance}}',
    accountEntity.balance
  );

  return accountTemplate;
};

/* ******** render accounts list on the browser ******** */
const renderAccountsList = accounts => {
  const accountsListElem = document.querySelector('.bank-accts-ls tbody');
  let accountsListHtml = '';

  accounts.forEach(account => {
    accountsListHtml += generateAccountsListHtml(accountsListTemplate, account);
  });

  accountsListElem.innerHTML = accountsListHtml;
};

/* ******** disallow action buttons from being clicked ******** */
const disableActionButtons = () => {
  const accountStatusElems = document.querySelectorAll('tbody .status');

  accountStatusElems.forEach(accountStatusElem => {
    if (/^active$/i.test(accountStatusElem.textContent)) {
      accountStatusElem.parentElement.classList.add('active-account');
    }

    if (/^dormant$/i.test(accountStatusElem.textContent)) {
      accountStatusElem.parentElement.classList.add('dormant-account');
    }

    if (/^draft$/i.test(accountStatusElem.textContent)) {
      accountStatusElem.parentElement.classList.add('draft-account');
    }
  });
};

/* ******** toggle modal display ******** */
const modalDisplayInit = () => {
  const bodyElem = document.body;
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const modalClosers = document.querySelectorAll('.modal-closer');

  modalTriggers.forEach(modalTrigger => {
    modalTrigger.addEventListener('click', () => {
      bodyElem.classList.remove('modal--hidden');
    });
  });

  modalClosers.forEach(modalCloser => {
    modalCloser.addEventListener('click', () => {
      const yesButton = document.querySelector('.btn-modal-yes');
      yesButton.removeEventListener('click', deleteAccount);
      yesButton.removeEventListener('click', activateOrDeactivateAccount);
      bodyElem.classList.add('modal--hidden');
    });
  });
};

/* ******** fetch all accounts records ******** */
const getAllAccounts = () => {
  const accountsListInnerContainer = document.querySelector(
    '.bank-accts-ls__inner'
  );
  const accountsListElem = document.querySelector('.bank-accts-ls tbody');
  const token = JSON.parse(localStorage.getItem('token'));

  // const url = 'http://localhost:3000/api/v1/accounts';
  const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/accounts';
  const init = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': token
    },
    method: 'GET'
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      accountsListInnerContainer.classList.remove('state--loading');
      accountsListInnerContainer.classList.add('state--no-data');
      accountsListElem.textContent = '';

      if (response.status !== 200) {
        const accountsListElemSpan = document.createElement('span');
        accountsListElemSpan.textContent = response.error;
        document
          .querySelector('.http-message')
          .appendChild(accountsListElemSpan);
        return null;
      }

      if (response.message) {
        const accountsListElemSpan = document.createElement('span');
        accountsListElemSpan.textContent = response.error;
        document
          .querySelector('.http-message')
          .appendChild(accountsListElemSpan);
        return null;
      }

      if (!response.data.length) {
        const accountsListElemSpan = document.createElement('span');
        accountsListElemSpan.textContent = 'No accounts in the database';
        document
          .querySelector('.http-message')
          .appendChild(accountsListElemSpan);
        return null;
      }

      accountsListInnerContainer.classList.remove('state--no-data');
      renderAccountsList(response.data);
      disableActionButtons();
      modalDisplayInit();
    })
    .catch(error => console.log(error.message));
};

getAllAccounts();

/* ******** show network message to client ******** */
const successMessageTemplate = document.querySelector('#success-popup-template')
  .textContent;
const failureMessageTemplate = document.querySelector('#failure-popup-template')
  .textContent;

const showMessage = (message, messageType) => {
  const yesButton = document.querySelector('.btn-modal-yes');
  const popupElem = document.querySelector('.popup');
  let htmlString;

  if (messageType === 'success') {
    const messageTemplate = successMessageTemplate;
    htmlString = messageTemplate.replace('{{message}}', message);
  } else {
    const messageTemplate = failureMessageTemplate;
    htmlString = messageTemplate.replace('{{message}}', message);
  }

  popupElem.textContent = '';
  popupElem.innerHTML = htmlString;
  popupElem.parentElement.classList.add('popup--visible');

  setTimeout(() => {
    popupElem.parentElement.classList.remove('popup--visible');
    yesButton.classList.remove('btn__loading-icon-visible');
  }, 3000);
};

/* ******** set account number value ******** */
let accountNumber;

const setAccountNumber = event => {
  const targetClasslist = event.target.classList;

  if (
    targetClasslist.contains('btn-table') ||
    targetClasslist.contains('icon-tbl')
  ) {
    let actionButtonElemCell;

    if (
      targetClasslist.contains('btn-table') ||
      targetClasslist.contains('icon-table')
    ) {
      actionButtonElemCell = event.target.parentElement;
    }

    if (targetClasslist.contains('icon-tbl--i')) {
      actionButtonElemCell = event.target.parentElement.parentElement;
    }

    const accountEntityElem = actionButtonElemCell.parentElement;
    const accountAttributesElems = accountEntityElem.children;

    for (let i = 0; i < accountAttributesElems.length; i++) {
      const accountAttributeElem = accountAttributesElems[i];
      if (accountAttributeElem.classList.contains('acct-num')) {
        accountNumber = accountAttributeElem.textContent;
      }
    }
  }
};

/* ******** delete a specific account ******** */
const deleteAccount = () => {
  const yesButton = document.querySelector('.btn-modal-yes');

  yesButton.classList.add('btn__loading-icon-visible');
  const token = JSON.parse(localStorage.getItem('token'));

  // const url = `http://localhost:3000/api/v1/accounts/${accountNumber}`;
  const url = `https://ile-ifowopamo.herokuapp.com/api/v1/accounts/${accountNumber}`;
  console.log(url);

  const init = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': token
    },
    method: 'DELETE'
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      if (response.status === 200) {
        showMessage(response.message, 'success');
        getAllAccounts();
        yesButton.removeEventListener('click', deleteAccount);
      }

      yesButton.classList.remove('btn__loading-icon-visible');
    })
    .catch(error => console.log(error.message));
};

/* ******** activate or deactivate an account ******** */
let newAccountStatus;

const activateOrDeactivateAccount = () => {
  const yesButton = document.querySelector('.btn-modal-yes');

  yesButton.classList.add('btn__loading-icon-visible');
  const token = JSON.parse(localStorage.getItem('token'));

  // const url = `http://localhost:3000/api/v1/accounts/${accountNumber}`;
  const url = `https://ile-ifowopamo.herokuapp.com/api/v1/accounts/${accountNumber}`;
  console.log(url);
  console.log(newAccountStatus);

  const init = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': token
    },
    method: 'PATCH',
    body: JSON.stringify({ accountStatus: newAccountStatus })
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      console.log(response);

      if (response.status === 400) {
        showMessage(response.error, 'failure');
        getAllAccounts();
        document.body.classList.add('modal--hidden');
        yesButton.classList.remove('btn__loading-icon-visible');
        yesButton.removeEventListener('click', activateOrDeactivateAccount);
        return null;
      }

      if (response.status === 200) {
        showMessage('Status changed successfully', 'success');
        getAllAccounts();
        document.body.classList.add('modal--hidden');
        yesButton.classList.remove('btn__loading-icon-visible');
        yesButton.removeEventListener('click', activateOrDeactivateAccount);
        return null;
      }
    })
    .catch(error => console.log(error.message));
};

/* ******** execute due action ******** */
const executeAction = event => {
  const yesButton = document.querySelector('.btn-modal-yes');
  const modalMessageElem = document.querySelector('.modal-message');
  const targetClasslist = event.target.classList;

  if (
    targetClasslist.contains('btn-table') ||
    targetClasslist.contains('icon-tbl')
  ) {
    if (
      targetClasslist.contains('btn-delete') ||
      targetClasslist.contains('icon-delete')
    ) {
      setAccountNumber(event);
      modalMessageElem.textContent = `Are you sure you want to delete this '${accountNumber}' account?`;
      yesButton.addEventListener('click', deleteAccount);
    }

    if (targetClasslist.contains('icon-activate')) {
      setAccountNumber(event);
      newAccountStatus = 'active';
      modalMessageElem.textContent = `Are you sure you want to activate this '${accountNumber}' account?`;
      yesButton.addEventListener('click', activateOrDeactivateAccount);
    }

    if (targetClasslist.contains('icon-deactivate')) {
      setAccountNumber(event);
      newAccountStatus = 'dormant';
      modalMessageElem.textContent = `Are you sure you want to deactivate this '${accountNumber}' account?`;
      yesButton.addEventListener('click', activateOrDeactivateAccount);
    }
  }
};

const accountsList = document.querySelector('.bank-accts-ls tbody');
accountsList.addEventListener('click', executeAction);
