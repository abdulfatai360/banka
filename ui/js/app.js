const localhost = 'http://localhost:3000/api/v1';
const heroku = 'https://ile-ifowopamo.herokuapp.com/api/v1';
const appUrl = heroku;

/* Toggle app navigation on sm screens */
const navOpenIcon = document.querySelector('.navicon-open');
const navCloseIcon = document.querySelector('.navicon-close');

navOpenIcon.addEventListener('click', () => {
  const bodyElem = document.querySelector('body');
  bodyElem.classList.add('sm-vp-nav-visible');
});

navCloseIcon.addEventListener('click', () => {
  const bodyElem = document.querySelector('body');
  bodyElem.classList.remove('sm-vp-nav-visible');
});
