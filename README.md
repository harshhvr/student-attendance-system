# Student Attendance System

## Table of Contents

- [Student Attendance System](#student-attendance-system)
  - [Table of Contents](#table-of-contents)
    - [Run](#run)
    - [Install Database](#install-database)
    - [Setup Environment Variables](#setup-environment-variables)
    - [Dependencies List](#dependencies-list)

### Run

```
npm install
npm start
```

### Install Database

* [`Database`](./src/databases/db.sql)
* [`Sample Database`](./src/databases/sample-db.sql)

### Setup Environment Variables

`.env` file structure:

```
PORT = port
DB_HOST = host
DB_USER = user
DB_PASS = password
DB_NAME = database

SESSION_SECRET = session_secret

ADMIN_EMAIL = username@example.com
```

### Dependencies List

```
"dependencies": {
    "bcryptjs": "^2.4.3",
    "bootstrap": "^5.1.3",
    "bootstrap-icons": "^1.8.3",
    "chart.js": "^3.8.0",
    "dotenv": "^16.0.1",
    "express": "^4.18.1",
    "express-handlebars": "^6.0.6",
    "express-session": "^1.17.3",
    "flipclock": "^0.10.8",
    "handlebars": "^4.7.7",
    "handlebars-dateformat": "^1.1.2",
    "joi": "^17.6.0",
    "jquery": "^3.6.0",
    "mysql": "^2.18.1",
    "nodemon": "^2.0.19"
}
```