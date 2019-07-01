/* ******** global variables ******** */
const cashierListTemplate = document.querySelector('#staff__cashier-template')
  .textContent;
const adminListTemplate = document.querySelector('#staff__admin-template')
  .textContent;

/* ******** generates staff list from the template ******** */
const generateStaffListHtml = (template, staffEntity) => {
  let staffTemplate = template;

  staffTemplate = staffTemplate.replace('{firstName}', staffEntity.firstName);
  staffTemplate = staffTemplate.replace('{{lastName}}', staffEntity.lastName);
  staffTemplate = staffTemplate.replace('{{email}}', staffEntity.email);
  staffTemplate = staffTemplate.replace('{{phone}}', staffEntity.phone);

  return staffTemplate;
};

/* ******** render staff list on the browser ******** */
const renderStaffList = staff => {
  const cashierListElem = document.querySelector('.staff__cashier tbody');
  const adminListElem = document.querySelector('.staff__admin tbody');

  let cashierListHtml = '';
  let adminListHtml = '';

  staff.forEach(cashier => {
    cashierListElem += generateStaffListHtml(cashierListTemplate, cashier);
  });

  staff.forEach(admin => {
    cashierListElem += generateStaffListHtml(adminListTemplate, admin);
  });

  cashierListElem.innerHTML = cashierListHtml;
  adminListElem.innerHTML = adminListHtml;
};

/* ******** fetch all accounts records ******** */
const getAllAccounts = () => {
  const accountsListInnerContainer = document.querySelector(
    '.bank-accts-ls__inner'
  );
  const accountsListElem = document.querySelector('.bank-accts-ls tbody');
  const token = JSON.parse(localStorage.getItem('token'));

  const url = `${appUrl}/accounts`;
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
