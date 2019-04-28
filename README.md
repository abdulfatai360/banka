[![Build Status](https://travis-ci.org/abdulfatai360/banka.svg?branch=develop)](https://travis-ci.org/abdulfatai360/banka)
[![Coverage Status](https://coveralls.io/repos/github/abdulfatai360/banka/badge.svg?branch=develop)](https://coveralls.io/github/abdulfatai360/banka?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/81fa4ec8fd399d2dee8a/maintainability)](https://codeclimate.com/github/abdulfatai360/banka/maintainability)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# Banka
Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can signup and create bank accounts online but must visit the branch to withdraw or deposit money. The app has three (3) levels of user: client, cashier, and admin.

## Features
- Client can sign up.
- Client can login.
- Client can create an account.
- Client can view account transaction history.
- Client can view a specific account transaction.
- Client can receive an email alert for account debit/credit transaction.
- Cashier can debit a client's account.
- Cashier can credit a client's account.
- Admin/cashier can view all users' accounts.
- Admin/cashier can view a specific user account.
- Admin/cashier can activate or deactivate an account.
- Admin/cashier can delete a specific user account.
- Admin can create cashier and admin user accounts.

## Getting Started
This section contains instructions that will get you a copy of the project up and running on your local machine for development and testing purposes.

### Pre-requisites
To get the project up and running, have the following installed on your local machine:
1. NodeJS
2. NPM

### Dependencies
| Name            | SemVer | Description/Purpose                                           |
|-----------------|--------|---------------------------------------------------------------|
| @babel/polyfill | 7.x    | Provides polyfills necessary for a full ES2015+ environment   |
| bcryptjs        | 2.x    | Library for hashing passwords                                 |
| dotenv          | 7.x    | Loads environment variables from .env file                    |
| express         | 4.x    | Web server framework                                          |
| helmet          | 3.x    | Help secure Express apps with various HTTP headers            |
| joi             | 14.x   | Object schema validation                                      |
| jsonwebtoken    | 8.x    | JSON Web Token implementation                                 |
| make-runnable   | 1.x    | Call a module's exported functions directly from command line |
| nodemailer      | 6.x    | Easy as cake e-mail sending from Node.js applications         |

### Development Dependencies
| Name                      | SemVer | Description/Purpose                                      |
|---------------------------|--------|----------------------------------------------------------|
| @babel/cli                | 7.x    | Babel command line                                       |
| @babel/core               | 7.x    | Babel compiler core                                      |
| @babel/preset-env         | 7.x    | A Babel preset for each environment                      |
| @babel/register           | 7.x    | Babel require hook                                       |
| chai                      | 4.x    | BDD/TDD assertion library for node.js and the browser    |
| chai-http                 | 4.x    | Extend Chai Assertion library with tests for http apis   |
| coveralls                 | 3.x    | Test coverage reporter                                   |
| eslint                    | 5.x    | An AST-based pattern checker for JavaScript              |
| eslint-config-airbnb-base | 13.x   | Airbnb's base JS ESLint config                           |
| eslint-plugin-import      | 2.x    | Support linting of ES2015+ (ES6+) import/export syntax   |
| eslint-plugin-mocha       | 5.x    | Eslint rules for mocha                                   |
| mocha                     | 6.x    | Test framework                                           |
| nodemon                   | 1.x    | Code monitor for use during development of a node.js app |
| nyc                       | 13.x   | Istanbul (test coverage tool) command line interface     |

### Installation
1. Clone the repository by running this command on terminal: `git clone https://github.com/abdulfatai360/banka.git`
2. Navigate to the project's directory using this command: `cd banka/`
3. Run `npm install` to install all dependencies (production and development)
4. Run `npm run build` to build the project or `npm run build:dev` to watch for changes and build
5. Run `npm start` to start the app's development server locally  or `npm run start:dev` to watch for changes 

### Database Setup
### Environment Variables Setup
Rename the .env.example file to .env and update the variables accordingly.

## Running Automated Tests
To run the tests, run the command `npm run test` or `npm run test:dev` to run the test without getting the test coverage report.

## Built With
### UI Templates
| Name       | Description/Purpose                                                                |
|------------|------------------------------------------------------------------------------------|
| HTML5      | A markup language that tells the browser how to interpret and structure a web page |
| CSS3       | A presentation language of style rules used for applying styling to HTML content   |
| JavaScript | A scripting or programming language for implementing complex things on web pages   |

### REST APIs
| Name    | Description/Purpose                                         |
|---------|-------------------------------------------------------------|
| NodeJS  | A JavaScript runtime built on Chrome's V8 JavaScript engine |
| Express | Fast, unopinionated, minimalist web framework for Node.js   |
| JWT     | JSON Web Token for authentication                           |

## Author
Abdulfatai Jimoh

## License
MIT License

## Credits

