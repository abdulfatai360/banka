/* ******** global variables ******** */
const signupForm = document.querySelector('.signup-form');
const validationErrorTemplate = document.querySelector(
  '#validation-error-list-template'
).textContent;
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

const renderValidationError = (errors, inputField, errorsListElem) => {
  let errorHtml = '';
  const errorMessages = errors;

  errorMessages.forEach(errorMessage => {
    errorHtml += convertTemplateToHtml(validationErrorTemplate, errorMessage);
  });

  errorsListElem.innerHTML = errorHtml;
  inputField.classList.add('input-not-validated');
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

/* ******** signup inputs frontend validations ******** */
class signupValidation {
  static validateFirstName() {
    const errors = [];
    const firstName = signupForm.firstName.value;
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    const errorsListElem = document.querySelector(
      '.first-name-field .validation-error-list'
    );
    errorsListElem.textContent = '';

    if (!firstName) errors.push('First name is required');

    if (!nameRegex.test(firstName)) {
      errors.push('First name should be a valid name');
    }

    if (firstName.length < 2 || firstName.length > 50) {
      errors.push(
        'First name should be minimum of 2 and maximum of 50 characters long'
      );
    }

    validationErrors.firstName = errors;

    if (validationErrors.firstName.length) {
      return renderValidationError(
        validationErrors.firstName,
        signupForm.firstName,
        errorsListElem
      );
    }

    signupForm.firstName.classList.remove('input-not-validated');
  }

  static validateLastName() {
    const errors = [];
    const lastName = signupForm.lastName.value;
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    const errorsListElem = document.querySelector(
      '.last-name-field .validation-error-list'
    );
    errorsListElem.textContent = '';

    if (!lastName) errors.push('Last name is required');

    if (!nameRegex.test(lastName)) {
      errors.push('Last name should be a valid name');
    }

    if (lastName.length < 2 || lastName.length > 50) {
      errors.push(
        'Last name should be minimum of 2 and maximum of 50 characters long'
      );
    }

    validationErrors.lastName = errors;

    if (validationErrors.lastName.length) {
      return renderValidationError(
        validationErrors.lastName,
        signupForm.lastName,
        errorsListElem
      );
    }

    signupForm.lastName.classList.remove('input-not-validated');
  }

  static validatePhone() {
    const errors = [];
    const phone = signupForm.phone.value;
    const phoneRegex = /^(\+234|234)[0-9]{10}$/;
    const errorsListElem = document.querySelector(
      '.phone-field .validation-error-list'
    );
    errorsListElem.textContent = '';

    if (!phone) errors.push('Phone number is required');

    if (!phoneRegex.test(phone)) {
      errors.push(
        'Phone should be a valid Nigerian phone number (formats: +234########## or 234##########)'
      );
    }

    validationErrors.phone = errors;

    if (validationErrors.phone.length) {
      return renderValidationError(
        validationErrors.phone,
        signupForm.phone,
        errorsListElem
      );
    }

    signupForm.phone.classList.remove('input-not-validated');
  }

  static validateEmail() {
    const errors = [];
    const email = signupForm.email.value;
    const emailRegex = /^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/;
    const errorsListElem = document.querySelector(
      '.email-field .validation-error-list'
    );
    errorsListElem.textContent = '';

    if (!email) errors.push('Email is required');

    if (!emailRegex.test(email)) {
      errors.push('Email should be a valid email address');
    }

    if (email.length < 3 || email.length > 254) {
      errors.push(
        'Email should be minimum of 3 and maximum of 254 characters long'
      );
    }

    validationErrors.email = errors;

    if (validationErrors.email.length) {
      return renderValidationError(
        validationErrors.email,
        signupForm.email,
        errorsListElem
      );
    }

    signupForm.email.classList.remove('input-not-validated');
  }

  static validatePassword() {
    const errors = [];
    const password = signupForm.password.value;
    const errorsListElem = document.querySelector(
      '.password-field .validation-error-list'
    );
    errorsListElem.textContent = '';

    if (!password) errors.push('Password is required');

    if (/\s/.test(password)) {
      errors.push('Password should not contain spaces');
    }

    if (password.length < 6 || password.length > 254) {
      errors.push(
        'Password should be minimum of 6 and maximum of 254 characters long'
      );
    }

    validationErrors.password = errors;

    if (validationErrors.password.length) {
      return renderValidationError(
        validationErrors.password,
        signupForm.password,
        errorsListElem
      );
    }

    signupForm.password.classList.remove('input-not-validated');
  }

  static validateConfirmPassword() {
    const errors = [];
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;
    const errorsListElem = document.querySelector(
      '.confirm-password-field .validation-error-list'
    );
    errorsListElem.textContent = '';

    if (password !== confirmPassword || !confirmPassword) {
      errors.push('Password does not match');
    }

    validationErrors.confirmPassword = errors;

    if (validationErrors.confirmPassword.length) {
      return renderValidationError(
        validationErrors.confirmPassword,
        signupForm.confirmPassword,
        errorsListElem
      );
    }

    signupForm.confirmPassword.classList.remove('input-not-validated');
  }

  static validateStaffType() {
    const errors = [];
    const staffType = signupForm.staffType.value;
    const staffTypePattern = /^(admin)|(cashier)$/i;
    const errorsListElem = document.querySelector(
      '.staff-type-field .validation-error-list'
    );
    errorsListElem.textContent = '';

    console.log(staffType)

    if (!staffTypePattern.test(staffType)) {
      errors.push('Staff type should be either "Admin" or "Cashier"');
    }

    validationErrors.staffType = errors;

    if (validationErrors.staffType.length) {
      return renderValidationError(
        validationErrors.staffType,
        signupForm.staffType,
        errorsListElem
      );
    }

    signupForm.staffType.classList.remove('input-not-validated');
  }

  static errorMessageExist() {
    signupValidation.validateFirstName();
    signupValidation.validateLastName();
    signupValidation.validatePhone();
    signupValidation.validateEmail();
    signupValidation.validatePassword();
    signupValidation.validateConfirmPassword();

    if (signupForm.staffType) {
      signupValidation.validateStaffType();
    }

    const inputsErrorMessages = Object.values(validationErrors);
    const arr = inputsErrorMessages.filter(inputErrorMsgs => {
      return inputErrorMsgs.length;
    });

    if (arr.length) {
      console.log('There are validation errors you need to fix');
      return true;
    }

    return false;
  }
}

/* ******** register new user function ******** */
const registerUser = userEntity => {
  const submitButton = document.querySelector('.submit-btn-field');
  const staffTypeField = document.querySelector('.staff-type-field');
  const url = `${appUrl}/auth/signup`;
  const init = {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    method: 'POST',
    body: JSON.stringify(userEntity)
  };

  if (staffTypeField) {
    init.headers['x-auth-token'] = JSON.parse(localStorage.getItem('token'));
  }

  fetch(url, init)
    .then(response => response.json())
    .then(response => {
      const { status, data } = response;
      if (status !== 201) {
        showMessage(response.error, 'failure');
        return false;
      }

      console.log(response);

      if (staffTypeField) {
        showMessage(
          `${userEntity.type} user successfully created`,
          'success'
        );
        return null;
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
    })
    .catch(error => {
      submitButton.classList.remove('btn__loading-icon-visible');
      console.log(error.message);
      showMessage('Check your network connection and try again', 'failure');
    });
};

/* ******** register user on form submission ******** */
signupForm.addEventListener('submit', event => {
  event.preventDefault();

  if (signupValidation.errorMessageExist()) return;

  const staffTypeField = document.querySelector('.staff-type-field');
  const submitButton = document.querySelector('.submit-btn-field');
  submitButton.classList.add('btn__loading-icon-visible');

  const userInfo = {
    firstName: signupForm.firstName.value,
    lastName: signupForm.lastName.value,
    phone: signupForm.phone.value,
    email: signupForm.email.value,
    password: signupForm.password.value,
  };

  if (staffTypeField) {
    userInfo.type = 'Staff';
    userInfo.isAdmin = (signupForm.staffType.value === 'Admin') ? true : false;
  }

  registerUser(userInfo);
});
