let destination; let btn;

const asyncComm = () => {
  btn.addEventListener('click', (e) => {
    btn.classList.add('btn__loading-icon-visible');

    setTimeout(() => {
      window.location = destination;
    }, 2000);
    e.stopPropagation();
  });
}

if (window.location.pathname.includes('/signin.html')) {
  console.log('signin');
  btn = document.querySelector('.btn-form');
  destination = 'cashier/index.html';
  asyncComm();
}

if (window.location.pathname.includes('/signup.html')) {
  console.log('signup');
  btn = document.querySelector('.btn-form');
  destination = 'user/index.html';
  asyncComm();
}

if (window.location.pathname.includes('user/index.html')) {
  console.log('user-dashboard');
  btns = document.querySelectorAll('a.btn-form');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btn.classList.add('btn__loading-icon-visible');

      setTimeout(() => {
        window.location = btn.href;
      }, 2000);

      e.preventDefault();
      e.stopPropagation();
    })
  });

  btn = document.querySelector('.btn-update-done');
  btn.addEventListener('click', () => {
    btn.classList.add('btn__loading-icon-visible');

    setTimeout(() => {
      document.body.classList.remove('update-profile-form-visible');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      btn.classList.remove('btn__loading-icon-visible');
    }, 2000);
  })
}

console.log(window.location);
