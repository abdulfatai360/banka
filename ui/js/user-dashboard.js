/* ******** global variables ******** */
const userInfoElem = document.querySelector('.user-info');
const userInfoTemplate = document.querySelector('#user-info-template').textContent;
const user = JSON.parse(localStorage.getItem('user'));

/* ******** populate user profile section ******** */
const generateUserInfoHtml = (template, userEntity) => {
  const userRole = JSON.parse(localStorage.getItem('userRole'));
  let userTemplate = template;

  userTemplate = userTemplate.replace('{{fullName}}', `${userEntity.firstName} ${userEntity.lastName}`);
  userTemplate = userTemplate.replace('{{email}}', userEntity.email);
  userTemplate = userTemplate.replace('{{phone}}', userEntity.phone);
  userTemplate = userTemplate.replace('{{role}}', userRole);

  return userTemplate;
};

const renderUserInfo = () => {
  const userInfoHtml = generateUserInfoHtml(userInfoTemplate, user);
  userInfoElem.innerHTML = userInfoHtml;
};

renderUserInfo();

/* ******** populate user account section ******** */

