const errorListTemplate = document.querySelector('#inputs-error-list-template').textContent;
const signupForm = document.querySelector('.signup-form');
const validationErrors = {};

const generateErrorMsgs = (template, msg) => {
  let errorTemplate = template;
  errorTemplate = errorTemplate.replace('{{errorMessage}}', msg);
  return errorTemplate;
};

const renderErrorMsgs = (errorMsgs, inputField, errorMsgList) => {
  const firstNameErrMsgs = errorMsgs;
  let errorHtml = '';

  firstNameErrMsgs.forEach(errorMsg => {
    errorHtml += generateErrorMsgs(errorListTemplate, errorMsg);
  });

  errorMsgList.innerHTML = errorHtml;

  inputField.parentNode.insertBefore(errorMsgList, inputField.nextSibling);

  inputField.classList.add('input-not-validated');
};

const validateFirstName = () => {
  const firstNameInput = signupForm.firstName.value;
  const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  const firstNameErrors = [];
  const errorMsgList = document.querySelector('.first-name-field .error-msg-list');
  errorMsgList.innerHTML = '';

  if (!firstNameInput) firstNameErrors.push('First name is required');

  if (!nameRegex.test(firstNameInput)) {
    firstNameErrors.push('First name should be a valid name');
  }

  if (firstNameInput.length < 2 || firstNameInput.length > 50) {
    firstNameErrors.push('First name should be minimum of 2 and maximum of 50 characters long');
  }

  validationErrors.firstName = firstNameErrors;

  if (validationErrors.firstName.length) {
    return renderErrorMsgs(validationErrors.firstName, signupForm.firstName, errorMsgList);
  }

  signupForm.firstName.classList.remove('input-not-validated');
};

const validateLastName = () => {
  const lastNameInput = signupForm.lastName.value;
  const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  const lastNameErrors = [];
  const errorMsgList = document.querySelector('.last-name-field .error-msg-list');
  errorMsgList.innerHTML = '';

  if (!lastNameInput) lastNameErrors.push('Last name is required');

  if (!nameRegex.test(lastNameInput)) {
    lastNameErrors.push('Last name should be a valid name');
  }

  if (lastNameInput.length < 2 || lastNameInput.length > 50) {
    lastNameErrors.push('Last name should be minimum of 2 and maximum of 50 characters long');
  }

  validationErrors.lastName = lastNameErrors;

  if (validationErrors.lastName.length) {
    return renderErrorMsgs(validationErrors.lastName, signupForm.lastName, errorMsgList);
  }

  signupForm.lastName.classList.remove('input-not-validated');
};

const validatePhone = () => {
  const phoneInput = signupForm.phone.value;
  const phoneRegex = /^(\+234|234)[0-9]{10}$/;
  const phoneErrors = [];
  const errorMsgList = document.querySelector('.phone-field .error-msg-list');
  errorMsgList.innerHTML = '';

  if (!phoneInput) phoneErrors.push('Phone number is required');

  if (!phoneRegex.test(phoneInput)) {
    phoneErrors.push('Phone number should be a valid Nigerian phone number. Formats: +234########## or 234##########');
  }

  validationErrors.phone = phoneErrors;

  if (validationErrors.phone.length) {
    return renderErrorMsgs(validationErrors.phone, signupForm.phone, errorMsgList);
  }

  signupForm.phone.classList.remove('input-not-validated');
};

const validateEmail = () => {
  const emailInput = signupForm.email.value;
  const emailRegex = /^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/;
  const emailErrors = [];
  const errorMsgList = document.querySelector('.email-field .error-msg-list');
  errorMsgList.innerHTML = '';

  if (!emailInput) emailErrors.push('Email is required');

  if (!emailRegex.test(emailInput)) {
    emailErrors.push('Email should be a valid email address');
  }

  if (emailInput.length < 3 || emailInput.length > 254) {
    emailErrors.push('Email should be minimum of 3 and maximum of 254 characters long');
  }

  validationErrors.email = emailErrors;

  if (validationErrors.email.length) {
    return renderErrorMsgs(validationErrors.email, signupForm.email, errorMsgList);
  }

  signupForm.email.classList.remove('input-not-validated');
};

const validatePassword = () => {
  const passwordInput = signupForm.password.value;
  const passwordErrors = [];
  const errorMsgList = document.querySelector('.password-field .error-msg-list');
  errorMsgList.innerHTML = '';

  if (!passwordInput) passwordErrors.push('Password is required');

  if (/\s/.test(passwordInput)) {
    passwordErrors.push('Password should not contain spaces');
  }

  if (passwordInput.length < 6 || passwordInput.length > 254) {
    passwordErrors.push('Password should be minimum of 6 and maximum of 254 characters long');
  }

  validationErrors.password = passwordErrors;

  if (validationErrors.password.length) {
    return renderErrorMsgs(validationErrors.password, signupForm.password, errorMsgList);
  }

  signupForm.password.classList.remove('input-not-validated');
};

const confirmPassword = () => {
  const passwordInput = signupForm.password.value;
  const confirmPasswordInput = signupForm.confirmPassword.value;
  const confirmPasswordErrors = [];
  const errorMsgList = document.querySelector('.confirm-password-field .error-msg-list');
  errorMsgList.innerHTML = '';

  if (passwordInput !== confirmPasswordInput || !confirmPasswordInput) {
    confirmPasswordErrors.push('Password does not match');
  }

  validationErrors.confirmPassword = confirmPasswordErrors;

  if (validationErrors.confirmPassword.length) {
    return renderErrorMsgs(validationErrors.confirmPassword, signupForm.confirmPassword, errorMsgList);
  }

  signupForm.confirmPassword.classList.remove('input-not-validated');
};

// validate inputs
const validateSignup = () => {
  validateFirstName();
  validateLastName();
  validatePhone();
  validateEmail();
  validatePassword();
  confirmPassword();
};

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  validateSignup();

  const errorMsgs = Object.values(validationErrors);
  const errorMsgExist = errorMsgs.filter(errMsg => errMsg.length);
  if (errorMsgExist.length) return;

  console.log('No validation error');

  const init = {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: 'POST',
    body: JSON.stringify({
      firstName: signupForm.firstName.value,
      lastName: signupForm.lastName.value,
      phone: signupForm.phone.value,
      email: signupForm.email.value,
      password: signupForm.password.value,
    })
  };

  fetch('https://ile-ifowopamo.herokuapp.com/api/v1/auth/signup', init)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error.message));
});
