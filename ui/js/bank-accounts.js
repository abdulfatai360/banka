const bodyElem = document.body;
const modalTriggers = document.querySelectorAll('.modal-trigger');
const overlay = document.querySelector('.overlay');
const modalClosers = document.querySelectorAll('.modal-closer');

const statusCells = document.querySelectorAll('tbody .status');
statusCells.forEach(statusCell => {
  if (/^active$/i.test(statusCell.textContent)) {
    statusCell.parentElement.classList.add('active-account');
  }

  if (/^dormant$/i.test(statusCell.textContent)) {
    statusCell.parentElement.classList.add('dormant-account');
  }
});

modalTriggers.forEach(modalTrigger => {
  modalTrigger.addEventListener('click', () => {
    bodyElem.classList.remove('modal--hidden');
  });
});

modalClosers.forEach(modalCloser => {
  modalCloser.addEventListener('click', () => {
    bodyElem.classList.add('modal--hidden');
  });
});
