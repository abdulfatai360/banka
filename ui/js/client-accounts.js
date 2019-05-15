/* ******** fetch client accounts details ******** */
const accountsDetailsTemplate = document.querySelector('#accts-details-template').textContent;

const generateAccountsDetailsHtml = (template, accountEntity) => {
  let accountTemplate = template;

  let createdOn = new Date(accountEntity.createdOn);
  createdOn = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(createdOn);

  accountTemplate = accountTemplate.replace('{{createdOn}}', createdOn);
  accountTemplate = accountTemplate.replace('{{accountNumber}}', accountEntity.accountNumber);
  accountTemplate = accountTemplate.replace('{{accountType}}', accountEntity.accountType);
  accountTemplate = accountTemplate.replace('{{accountStatus}}', accountEntity.accountStatus);
  accountTemplate = accountTemplate.replace('{{openingBalance}}', accountEntity.openingBalance);
  accountTemplate = accountTemplate.replace('{{currentBalance}}', accountEntity.balance);

  return accountTemplate;
};

const renderAccountsDetails = (accounts) => {
  const accountsDetailsElem = document.querySelector('.accts-details tbody');
  let accountsDetailsHtml = '';

  accounts.forEach(account => {
    accountsDetailsHtml += generateAccountsDetailsHtml(accountsDetailsTemplate, account);
  })

  accountsDetailsElem.innerHTML = accountsDetailsHtml;
};

const fetchClientAccounts = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  const accountsDetailsElem = document.querySelector('.accts-details tbody');

  const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/user/accounts';
  // const url = 'http://localhost:3000/api/v1/user/accounts';
  const init = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-auth-token": token
    }
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      accountsDetailsElem.textContent = '';
      document.querySelector('.http-message').textContent = '';
      document.querySelector('.accts-details__inner')
        .classList.remove('state--loading');

      if (response.status !== 200) {
        const accountsDetailsElemSpan = document.createElement('span');
        accountsDetailsElemSpan.textContent = response.error;
        document.querySelector('.http-message')
          .appendChild(accountsDetailsElemSpan);
        return false;
      }

      if (response.message) {
        const accountsDetailsElemSpan = document.createElement('span');
        accountsDetailsElemSpan.textContent = response.message;
        document.querySelector('.http-message')
          .appendChild(accountsDetailsElemSpan);
        return true;
      }

      document.querySelector('.accts-details__inner').classList.remove('state--no-data');

      renderAccountsDetails(response.data);
    })
    .catch(error => console.log(error.message));
};

fetchClientAccounts();

/* ******** toggling account opening form display ******** */
const accountOpeningFormHeading = document.querySelector('.acct-opening h2');

const resetAccountOpeningForm = () => {
  const errsListElems = document.querySelectorAll('.form-field .validation-error-list');
  const accountOpeningInputs = [
    accountOpeningForm.openingBalance,
    accountOpeningForm.accountType
  ];

  accountOpeningInputs.forEach(input => input.classList.remove('input-not-validated'));
  errsListElems.forEach(errListElem => errListElem.textContent = '');
};

const prePopulateAccountOwnerNames = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  accountOpeningForm.firstName.value = user.firstName;
  accountOpeningForm.lastName.value = user.lastName;
};

const toggleAccountOpeningFormDisplay = () => {
  const accountOpeningFormContainer = document.querySelector('.acct-opening');
  accountOpeningFormContainer.classList.toggle('acct-opn-form-visible');

  if (!accountOpeningFormContainer.classList.contains('acct-opn-form-visible')) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

accountOpeningFormHeading.addEventListener('click', () => {
  accountOpeningForm.reset();
  resetAccountOpeningForm();
  prePopulateAccountOwnerNames();
  toggleAccountOpeningFormDisplay();
});


/* ******** bank account opening functionality ******** */
const accountOpeningForm = document.querySelector('.acct-opening-form');
const validationErrorTemplate = document.querySelector('#validation-error-list-template').textContent;
const validationErrors = {};

const convertTemplateToHtml = (template, message) => {
  const messageTemplate = template;
  const messageHtml = messageTemplate.replace('{{message}}', message);
  return messageHtml;
};

const renderValidationError = (errors, inputField, errorsListElem) => {
  let errorHtml = '';
  const errorMessages = errors;

  errorMessages.forEach(errorMessage => {
    errorHtml += convertTemplateToHtml(validationErrorTemplate, errorMessage);
  });

  errorsListElem.innerHTML = errorHtml;
  inputField.classList.add('input-not-validated');
};

class validateAccountOpeningInputs {
  static openingBalance(errors) {
    const errorsListElem = document.querySelector('.opening-balance-field .validation-error-list');
    errorsListElem.textContent = '';

    validationErrors.openingBalance = errors.filter((error) => {
      return /^opening balance/i.test(error);
    });

    if (validationErrors.openingBalance.length) {
      return renderValidationError(validationErrors.openingBalance, accountOpeningForm.openingBalance, errorsListElem);
    }

    accountOpeningForm.openingBalance.classList.remove('input-not-validated');
  }

  static accountType(errors) {
    const errorsListElem = document.querySelector('.account-type-field .validation-error-list');
    errorsListElem.textContent = '';

    validationErrors.accountType = errors.filter((error) => {
      return /^account type/i.test(error);
    });

    if (validationErrors.accountType.length) {
      return renderValidationError(validationErrors.accountType, accountOpeningForm.accountType, errorsListElem);
    }

    accountOpeningForm.accountType.classList.remove('input-not-validated');
  }
}

const openBankAccount = (accountInfo) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const submitButtonField = document.querySelector('.submit-btn-field');
  const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/accounts';
  // const url = 'http://localhost:3000/api/v1/accounts';
  const init = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-auth-token": token
    },
    method: 'POST',
    body: JSON.stringify(accountInfo),
  };

  fetch(url, init)
    .then(response => response.json())
    .then((response) => {
      submitButtonField.classList.remove('btn__loading-icon-visible');
      const { status } = response;

      if (status === 422) {
        const { errors } = response;
        validateAccountOpeningInputs.openingBalance(errors);
        validateAccountOpeningInputs.accountType(errors);

        console.log('There are validation errors you need to fix');
        return false;
      }

      resetAccountOpeningForm();
      fetchClientAccounts();
      toggleAccountOpeningFormDisplay();
    })
    .catch(error => {
      submitButtonField.classList.remove('btn__loading-icon-visible');
      console.log(error.message);
      showMessage('Check your network connection and try again', 'failure');
    });
};

accountOpeningForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const submitButtonField = document.querySelector('.submit-btn-field');
  submitButtonField.classList.add('btn__loading-icon-visible');

  openBankAccount({
    openingBalance: accountOpeningForm.openingBalance.value,
    accountType: accountOpeningForm.accountType.value
  })
});
