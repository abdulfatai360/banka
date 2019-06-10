const localhostUrl = 'http://localhost:3000/api/v1';
const herokuUrl = 'https://ile-ifowopamo.herokuapp.com/api/v1';
const appsUrl = herokuUrl;

/* ******** check if authorization token exists/has expired ******** */
const authToken = JSON.parse(localStorage.getItem('token'));
const userRole = JSON.parse(localStorage.getItem('userRole'));
const currPageUrl = window.location.pathname;

if (!authToken) window.location = '../signin.html';

const url = `${appsUrl}/tokens/expiration`;
const myInit = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  body: JSON.stringify({ token: authToken }),
  method: 'POST'
};

fetch(url, myInit)
  .then(response => response.json())
  .then(response => {
    const { status } = response;
    if (status === 400) return null; // token valid

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');

    window.location = '../signin.html';
  })
  .catch(error => console.log(error));

if (currPageUrl.includes('/user') && !/^client$/i.test(userRole)) {
  window.location = '../signin.html';
}

if (currPageUrl.includes('/cashier') && !/^cashier$/i.test(userRole)) {
  window.location = '../signin.html';
}

if (currPageUrl.includes('/admin') && !/^admin$/i.test(userRole)) {
  window.location = '../signin.html';
}
