/* ******** global variables ******** */
const accountsListTemplate = document.querySelector('#bank-accts-ls-template').textContent;

/* ******** generates accounts list from the template ******** */
const generateAccountsListHtml = (template, accountEntity) => {
  let accountTemplate = template;

  let createdOn = new Date(accountEntity.createdOn);
  createdOn = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(createdOn);

  accountTemplate = accountTemplate.replace('{{createdOn}}', createdOn);
  accountTemplate = accountTemplate.replace('{{accountNumber}}', accountEntity.accountNumber);
  accountTemplate = accountTemplate.replace('{{type}}', accountEntity.accountType);
  accountTemplate = accountTemplate.replace('{{status}}', accountEntity.accountStatus);
  accountTemplate = accountTemplate.replace('{{openingBalance}}', accountEntity.openingBalance);
  accountTemplate = accountTemplate.replace('{{balance}}', accountEntity.balance);

  return accountTemplate;
};

/* ******** render accounts list on the browser ******** */
const renderAccountsList = (accounts) => {
  const accountsListElem = document.querySelector('.bank-accts-ls tbody');
  let accountsListHtml = '';

  accounts.forEach(account => {
    accountsListHtml += generateAccountsListHtml(accountsListTemplate, account);
  })

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
      bodyElem.classList.add('modal--hidden');
    });
  });
};

/* ******** fetch all accounts records ******** */
const getAllAccounts = () => {
  const accountsListInnerContainer = document.querySelector('.bank-accts-ls__inner');
  const accountsListElem = document.querySelector('.bank-accts-ls tbody');
  const token = JSON.parse(localStorage.getItem('token'));

  // const url = 'http://localhost:3000/api/v1/accounts';
  const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/accounts';
  const init = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-auth-token": token
    },
    method: 'GET'
  };

  fetch(url, init)
    .then(response => response.json())
    .then((response) => {
      accountsListInnerContainer.classList.remove('state--loading');
      accountsListInnerContainer.classList.add('state--no-data');
      accountsListElem.textContent = '';

      if (response.status !== 200) {
        const accountsListElemSpan = document.createElement('span');
        accountsListElemSpan.textContent = response.error;
        document.querySelector('.http-message')
          .appendChild(accountsListElemSpan);
        return false;
      }

      if (response.message) {
        const accountsListElemSpan = document.createElement('span');
        accountsListElemSpan.textContent = response.error;
        document.querySelector('.http-message')
          .appendChild(accountsListElemSpan);
        return true;
      }

      if (!response.data.length) {
        const accountsListElemSpan = document.createElement('span');
        accountsListElemSpan.textContent = 'No accounts in the database';
        document.querySelector('.http-message')
          .appendChild(accountsListElemSpan);
        return true;
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
const successMessageTemplate = document.querySelector('#success-popup-template').textContent;
const failureMessageTemplate = document.querySelector('#failure-popup-template').textContent;

const showMessage = (message, messageType) => {
  const yesButton = document.querySelector('.btn-modal-yes');
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
    yesButton.classList.remove('btn__loading-icon-visible');
  }, 3000);
};


/* ******** delete a specific account ******** */
const deleteAccount = (accountNumber) => {
  const yesButton = document.querySelector('.btn-modal-yes');

  const performAction = () => {
    yesButton.classList.add('btn__loading-icon-visible');
    const token = JSON.parse(localStorage.getItem('token'));

    // const url = `http://localhost:3000/api/v1/accounts/${accountNumber}`;
    const url = `https://ile-ifowopamo.herokuapp.com/api/v1/accounts/${accountNumber}`;

    const init = {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-auth-token": token
      },
      method: 'DELETE'
    };

    fetch(url, init)
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          showMessage(response.message, 'success');
          document.body.classList.add('modal--hidden');

          getAllAccounts();
          yesButton.removeEventListener('click', performAction);
        }
      })
      .catch(error => console.log(error.message));
  };

  yesButton.addEventListener('click', performAction);
};

/* ******** get account number value and perform due action ******** */
const getAccountNumberAndPerformAction = (event) => {
  if (event.target.classList.contains('btn-table')) {
    let accountNumber;
    let actionToPerform;
    const modalMessageElem = document.querySelector('.modal-message');

    const actionButtonElemCell = event.target.parentElement;
    const accountEntityElem = actionButtonElemCell.parentElement;
    const accountAttributesElems = accountEntityElem.children;

    for (let i = 0; i < accountAttributesElems.length; i++) {
      const accountAttributeElem = accountAttributesElems[i];
      if (accountAttributeElem.classList.contains('acct-num')) {
        accountNumber = accountAttributeElem.textContent;
      }
    }

    if (event.target.classList.contains('btn-delete')) {
      actionToPerform = 'delete';
      modalMessageElem.textContent = `Are you sure you want to ${actionToPerform} this '${accountNumber}' account?`
      deleteAccount(accountNumber);
    }
  }  
}

const accountsList = document.querySelector('.bank-accts-ls tbody');
accountsList.addEventListener('click', getAccountNumberAndPerformAction);
