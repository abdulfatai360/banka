const bodyElem = document.body;
const profileEditBtn = document.querySelector('.btn-edit-profile');
const updateCancelBtn = document.querySelector('.btn-update-cancel');
const changePasswordBtn = document.querySelector('.change-pw-btn');
const newPasswordField = document.querySelector('.new-password-field');

profileEditBtn.addEventListener('click', () => {
  bodyElem.classList.remove('user-profile-visible');
  bodyElem.classList.add('update-profile-form-visible');

  const userPhoto = document.querySelector('.user-photo__inner');
  const profileImageLabel = document.querySelector('label[for="profile-image"]');

  const userPhotoStyle = getComputedStyle(userPhoto);
  const profileImageLabelStyle = getComputedStyle(profileImageLabel);

  profileImageLabel.style.cssText = `
    width: ${profileImageLabelStyle.width};
    height: ${profileImageLabelStyle.height};
    padding: ${profileImageLabelStyle.padding};
    display: ${profileImageLabelStyle.display};
    position: ${profileImageLabelStyle.position};
    border: ${profileImageLabelStyle.border};
    border-radius: ${profileImageLabelStyle.borderRadius};
    background-image: ${userPhotoStyle.backgroundImage};
    background-repeat: ${userPhotoStyle.backgroundRepeat};
    background-position: ${userPhotoStyle.backgroundPosition};
    background-size: ${userPhotoStyle.backgroundSize};
    background-clip: ${userPhotoStyle.backgroundClip};
  `;
});

function isImageValid(str) {
  const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
  for (let i = 0; i < fileType.length; i++) {
    if (str === fileType[i]) { return true };
  }
  return false;
}

const imageInput = document.querySelector('input[type="file"]');

function profileImgHandler() {
  const profileImageLabel = document.querySelector('label[for="profile-image"]');

  const selectFile = imageInput.files[0];

  if (isImageValid(selectFile.type)) {
    window.URL = window.URL || window.webkitURL;
    profileImageLabel.style.backgroundImage = `url(${window.URL.createObjectURL(selectFile)})`;
  }
}

imageInput.addEventListener('change', profileImgHandler);

changePasswordBtn.addEventListener('click', () => {
  bodyElem.classList.toggle('new-password-field-visible');
})

updateCancelBtn.addEventListener('click', () => {
  bodyElem.classList.remove('update-profile-form-visible');
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
});
