const authToken = JSON.parse(localStorage.getItem('token'));
const userRole = JSON.parse(localStorage.getItem('userRole'));
const currPageUrl = window.location.pathname

if (!authToken) window.location = '../signin.html';

if (currPageUrl.includes('/user') && !/^client$/i.test(userRole)) {
  window.location = '../signin.html';
}

if (currPageUrl.includes('/cashier') && !/^cashier$/i.test(userRole)) {
  window.location = '../signin.html';
}

if (currPageUrl.includes('/admin') && !/^admin$/i.test(userRole)) {
  window.location = '../signin.html';
}
