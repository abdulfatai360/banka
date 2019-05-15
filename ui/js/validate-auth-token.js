/* ******** check if authorization token exists/has expired ******** */
const authToken = JSON.parse(localStorage.getItem('token'));
const userRole = JSON.parse(localStorage.getItem('userRole'));
const currPageUrl = window.location.pathname

if (!authToken) window.location = '../signin.html';

// const url = 'https://ile-ifowopamo.herokuapp.com/api/v1/accounts';
// const url = 'http://localhost:3000/api/v1/accounts';
// const init = {
//   headers: {
//     "Content-Type": "application/json; charset=utf-8",
//     "x-auth-token": authToken
//   }
// };

// fetch(url, init)
//   .then(response => response.json())
//   .then(response => {
//     const { status } = response;
//     if (status === 401) {
//       window.location = '../signin.html';
//     }
//   });


if (currPageUrl.includes('/user') && !/^client$/i.test(userRole)) {
  window.location = '../signin.html';
}

if (currPageUrl.includes('/cashier') && !/^cashier$/i.test(userRole)) {
  window.location = '../signin.html';
}

if (currPageUrl.includes('/admin') && !/^admin$/i.test(userRole)) {
  window.location = '../signin.html';
}


