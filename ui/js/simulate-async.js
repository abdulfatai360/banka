let destination;

const asyncComm = (btn) => {
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

if (window.location.pathname.includes('user/accounts.html')) {
  console.log('user-accounts');
  btn = document.querySelector('.btn-create-acct');

  btn.addEventListener('click', () => {
    btn.classList.add('btn__loading-icon-visible');

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      document.body.classList.remove('acct-opn-form-visible');
      btn.classList.remove('btn__loading-icon-visible');
    }, 2000);
  });
}

if (window.location.pathname.includes('user/transactions.html')) {
  console.log('user-transactions');
  btn = document.querySelector('.btn-form');

  btn.addEventListener('click', () => {
    btn.classList.add('btn__loading-icon-visible');

    setTimeout(() => {
      window.scrollTo({
        top: 500,
        behavior: 'smooth'
      });

      btn.classList.remove('btn__loading-icon-visible');
    }, 2000);
  })
}

if (window.location.pathname.includes('cashier/index.html')) {
  console.log('cashier-dashboard');

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

if (window.location.pathname.includes('cashier/post-transaction.html')) {
  console.log('post-transaction');
  btn = document.querySelector('.btn-form');
  destination = 'index.html';
  asyncComm();
}

if (window.location.pathname.includes('admin/index.html')) {
  console.log('admin-dashboard');

  btn = document.querySelector('.btn-update-done');
  btn.addEventListener('click', () => {
    btn.classList.add('btn__loading-icon-visible');

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      console.log(btn)
      document.body.classList.remove('update-profile-form-visible');
      btn.classList.remove('btn__loading-icon-visible');
    }, 2000);
  })

  const btns = document.querySelectorAll('.btn-table');
  btns.forEach(el => {
    el.addEventListener('click', () => {
      el.classList.add('btn__loading-icon-visible');

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        console.log(el)
        el.classList.remove('btn__loading-icon-visible');
      }, 2000);
    })
  });
}

if (window.location.pathname.includes('admin/bank-accounts.html')) {
  console.log('admin/bank-accounts.html');
  const btns = document.querySelectorAll('.btn-table');

  btns.forEach(btn => {
    destination = 'bank-accounts.html';
    asyncComm(btn);
  })
}

console.log(window.location);
