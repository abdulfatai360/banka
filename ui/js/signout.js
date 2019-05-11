const signOutNavMenu = document.querySelector('.signout-menu');

const signUserOut = () => {
  const signOutNavMenuLink = document.querySelector('.signout-menu a');

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');

  window.location = signOutNavMenuLink.href;
};

signOutNavMenu.addEventListener('click', (event) => {
  event.preventDefault();
  signUserOut();
})
