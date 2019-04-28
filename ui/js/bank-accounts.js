const bodyElem = document.body;
const actionButtons = document.querySelectorAll('.action .btn');
const overlay = document.querySelector('.overlay');
const noButton = document.querySelector('.btn-dialog-no');
const overlayCloseIcon = document.querySelector('.overlay-close');
const overlayClosers = [overlay, overlayCloseIcon, noButton];

const statusCells = document.querySelectorAll('tbody .status');
statusCells.forEach(statusCell => {
  if (/^active$/i.test(statusCell.textContent)) {
    statusCell.parentElement.classList.add('active-account');
  }

  if (/^dormant$/i.test(statusCell.textContent)) {
    statusCell.parentElement.classList.add('dormant-account');
  }
});

actionButtons.forEach(actionButton => {
  actionButton.addEventListener('click', () => {
    bodyElem.classList.add('confirmation-dialog-visible');
  });
});

overlayClosers.forEach(closer => {
  closer.addEventListener('click', () => {
    bodyElem.classList.remove('confirmation-dialog-visible');
  });
});
