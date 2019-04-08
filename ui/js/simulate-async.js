//  Simulate async operation using setTimeout API
// asyncComm rename to simulateAsync
const simulateAsync = async (trigger, dest) => {
  trigger.addEventListener('click', (e) => {
    trigger.classList.add('btn__loading-icon-visible');

    setTimeout(() => {
      window.location = dest;
    }, 2000);

    e.preventDefault();
    e.stopPropagation();
  });
}

// Store the current path into a variable
const pageUrl = window.location.pathname;

function setBtnAndDest(curr, dest, btnClass) {
  console.log(curr);
  const btn = document.querySelector(btnClass);
  const destination = dest;

  simulateAsync(btn, destination);
}

if (pageUrl.includes('/signin.html')) {
  setBtnAndDest('/signin.html', 'cashier/index.html', '.btn-form');
}

if (pageUrl.includes('/signup.html')) {
  setBtnAndDest('/signup.html', 'user/index.html', '.btn-form');
}

if (pageUrl.includes('user/index.html')) {
  console.log('user/index.html');
  const linkBtns = document.querySelectorAll('a.btn-form');
  linkBtns.forEach(linkBtn => {
    const destination = linkBtn.href;
    simulateAsync(linkBtn, destination)
  });

  const profileUpdateBtn = document.querySelector('.btn-update-done');
  const destination = 'index.html'
  simulateAsync(profileUpdateBtn, destination);
}

if (pageUrl.includes('user/accounts.html')) {
  setBtnAndDest('user/accounts.html', 'accounts.html', '.btn-create-acct');
}

if (pageUrl.includes('user/transactions.html')) {
  setBtnAndDest('user/transactions.html', 'transactions.html', '.btn-form');
}

if (pageUrl.includes('cashier/index.html')) {
  setBtnAndDest('cashier/index.html', 'index.html', '.btn-update-done');
}

if (pageUrl.includes('cashier/bank-accounts.html') || pageUrl.includes('admin/bank-accounts.html')) {
  console.log('cashier/bank-accounts.html or admin/bank-accounts.html');
  const btns = document.querySelectorAll('.btn-table');

  btns.forEach(btn => {
    destination = 'bank-accounts.html';
    simulateAsync(btn, destination);
  })
}

if (pageUrl.includes('cashier/post-transaction.html')) {
  setBtnAndDest('cashier/post-transaction.html', 'index.html', '.btn-form');
}

if (pageUrl.includes('admin/index.html')) {
  setBtnAndDest('admin/index.html', 'index.html', '.btn-update-done');

  const btns = document.querySelectorAll('.btn-table');
  btns.forEach(el => simulateAsync(el, destination));
}

if (pageUrl.includes('admin/create-staff-account.html')) {
  setBtnAndDest('admin/create-staff-account.html', 'index.html', '.btn-form');
}
