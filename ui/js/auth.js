const bodyElem = document.body;
let formBtn; let destination;

function authenticateUser() {
  formBtn.addEventListener('click', () => {
    bodyElem.classList.add('btn__loading-icon-visible');

    setTimeout(() => {
      window.location = destination;
    }, 3000);
  });
}

if (window.location.pathname.includes('/signin.html')) {
  console.log('signin');
  formBtn = document.querySelector('.signin-form .btn-form');
  destination = 'cashier/index.html';
  authenticateUser();
}

if (window.location.pathname.includes('/signup.html')) {
  console.log('signup');
  formBtn = document.querySelector('.signup-form .btn-form');
  destination = 'user/index.html';
  authenticateUser();
}

console.log(window.location);
