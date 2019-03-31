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

if (pageUrl.includes('/signin.html')) {
  console.log('/signin.html');
  const btn = document.querySelector('.btn-form');
  const destination = 'cashier/index.html';

  simulateAsync(btn, destination);
}

if (pageUrl.includes('/signup.html')) {
  console.log('/signup.html');
  const btn = document.querySelector('.btn-form');
  const destination = 'user/index.html';

  simulateAsync(btn, destination);
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
  console.log('user/accounts.html');
  const btn = document.querySelector('.btn-create-acct');
  const destination = 'accounts.html';

  simulateAsync(btn, destination);
}

if (pageUrl.includes('user/transactions.html')) {
  console.log('user/transactions.html');
  const btn = document.querySelector('.btn-form');
  const destination = 'transactions.html';

  simulateAsync(btn, destination).then(() => {
    window.scrollTo({
      top: 500,
      behavior: 'smooth'
    });
  });
}

if (pageUrl.includes('cashier/index.html')) {
  console.log('cashier/index.html');
  const profileUpdateBtn = document.querySelector('.btn-update-done');
  const destination = 'index.html';

  simulateAsync(profileUpdateBtn, destination);
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
  console.log('cashier/post-transaction.html');
  const btn = document.querySelector('.btn-form');
  destination = 'index.html';

  simulateAsync(btn, destination);
}

if (pageUrl.includes('admin/index.html')) {
  console.log('admin/index.html');
  const btn = document.querySelector('.btn-update-done');
  const destination = 'index.html';

  simulateAsync(btn, destination);

  const btns = document.querySelectorAll('.btn-table');
  btns.forEach(el => simulateAsync(el, destination));
}

if (pageUrl.includes('admin/create-staff-account.html')) {
  console.log('admin/create-staff-account.html');
  const btn = document.querySelector('.btn-form');
  destination = 'index.html';

  simulateAsync(btn, destination);
}

console.log(window.location);
