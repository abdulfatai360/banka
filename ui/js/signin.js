/* ******** global variables ******** */
const signinForm = document.querySelector('.signin-form');
const httpMessageTemplate = document.querySelector('#success-popup-template')
  .textContent;
const httpErrorTemplate = document.querySelector('#failure-popup-template')
  .textContent;
const validationErrors = {};

/* ******** helper functions ******** */
const convertTemplateToHtml = (template, message) => {
  const messageTemplate = template;
  const messageHtml = messageTemplate.replace('{{message}}', message);
  return messageHtml;
};

const showMessage = (message, messageType) => {
  const submitButtonField = document.querySelector('.submit-btn-field');
  const popupElem = document.querySelector('.popup');
  let htmlString;

  if (messageType === 'success') {
    htmlString = convertTemplateToHtml(httpMessageTemplate, message);
  } else {
    htmlString = convertTemplateToHtml(httpErrorTemplate, message);
  }

  popupElem.textContent = '';
  popupElem.innerHTML = htmlString;
  popupElem.parentElement.classList.add('popup--visible');
  setTimeout(() => {
    popupElem.parentElement.classList.remove('popup--visible');
    submitButtonField.classList.remove('btn__loading-icon-visible');
  }, 3000);
};

/* ******** login user function ******** */
const loginUser = credentials => {
  const submitButtonField = document.querySelector('.submit-btn-field');
  const url = `${appUrl}/auth/signin`;
  const init = {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    method: 'POST',
    body: JSON.stringify(credentials)
  };

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      const { status, data } = response;
      if (status !== 200) {
        showMessage(response.error, 'failure');
        return false;
      }

      const user = {
        id: data[0].id,
        firstName: data[0].firstName,
        lastName: data[0].lastName,
        phone: data[0].phone,
        email: data[0].email,
        type: data[0].type
      };

      localStorage.setItem('token', JSON.stringify(data[0].token));
      localStorage.setItem('user', JSON.stringify(user));

      if (/^client$/i.test(data[0].type)) {
        localStorage.setItem('userRole', JSON.stringify(data[0].type));
        window.location = 'user/index.html';
      }

      if (/^staff$/i.test(data[0].type)) {
        if (data[0].isAdmin === false) {
          localStorage.setItem('userRole', JSON.stringify('Cashier'));
          window.location = 'cashier/index.html';
        }

        if (data[0].isAdmin === true) {
          localStorage.setItem('userRole', JSON.stringify('Admin'));
          window.location = 'admin/index.html';
        }
      }
    })
    .catch(error => {
      submitButtonField.classList.remove('btn__loading-icon-visible');
      console.log(error.message);
      showMessage('Check your network connection and try again', 'failure');
    });
};

/* ******** register user on form submission ******** */
signinForm.addEventListener('submit', event => {
  event.preventDefault();

  const submitButtonField = document.querySelector('.submit-btn-field');
  submitButtonField.classList.add('btn__loading-icon-visible');

  loginUser({
    email: signinForm.email.value,
    password: signinForm.password.value
  });
});
