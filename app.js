const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const users = require('./routes/users');
const roles = require('./routes/roles');
const projects = require('./routes/projects');
const projectTypes = require('./routes/project_types');
const projectProgressUpload = require('./routes/project_progress_upload');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.use('/api/users', users);
app.use('/api/roles', roles);
app.use('/api/projects', projects);
app.use('/api/projecttypes', projectTypes);
app.use('/api/projectprogressupload', projectProgressUpload);

app.listen(3300);
