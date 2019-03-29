const bodyElem = document.querySelector('body');
const acctOpnFormHeading = document.querySelector('.acct-opening h2');

acctOpnFormHeading.addEventListener('click', () => {
  bodyElem.classList.toggle('acct-opn-form-visible');

  if (!bodyElem.classList.contains('acct-opn-form-visible')) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
});


