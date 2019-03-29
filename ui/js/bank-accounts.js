const bodyElem = document.body;
const table = document.querySelector('table');
const overlay = document.querySelector('.overlay');
const overlayCloseIcon = document.querySelector('.overlay-close');
const overlayClosers = [overlay, overlayCloseIcon];

table.addEventListener('click', e => {
  if (e.target.classList.contains('link-in-p')) {
    bodyElem.classList.add('specific-bank-acct-visible');
  }
});

overlayClosers.forEach(closer => {
  closer.addEventListener('click', () => {
    bodyElem.classList.remove('specific-bank-acct-visible');
  });
});
