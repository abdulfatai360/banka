const bodyElem = document.body;
const table = document.querySelector('table');
const overlay = document.querySelector('.overlay');
const noButton = document.querySelector('.btn-no');
const overlayCloseIcon = document.querySelector('.overlay-close');
const overlayClosers = [overlay, overlayCloseIcon, noButton];

const statusCells = document.querySelectorAll('tbody .status');
statusCells.forEach(statusCell => {
  if (statusCell.textContent === 'Active') {
    statusCell.parentElement.classList.add('active-row');
  }

  if (statusCell.textContent === 'Dormant') {
    statusCell.parentElement.classList.add('dormant-row');
  }
});


table.addEventListener('click', e => {
  if (e.target.classList.contains('icon-table__inner') || e.target.classList.contains('btn__text')) {
    bodyElem.classList.add('confirmation-dialog-visible');
  }
}, false);

overlayClosers.forEach(closer => {
  closer.addEventListener('click', () => {
    bodyElem.classList.remove('confirmation-dialog-visible');
  });
});
