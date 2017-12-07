const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { Client } = require('pg');
const dotenv = require('dotenv').config();

const index = require('./routes/index');
const users = require('./routes/users');
const roles = require('./routes/roles');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.use('/api/users', users);
app.use('/api/roles', roles);

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD || null,
  port: process.env.DB_PORT,
})
client.connect();

client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  // client.end();
})

app.locals.db = client;

app.listen(3000);
