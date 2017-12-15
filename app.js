const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const security = require('./routes/security');
const users = require('./routes/users');
const roles = require('./routes/roles');
const projects = require('./routes/projects');
const projectTypes = require('./routes/project_types');
const projectProgresses = require('./routes/project_progresses');
const projectProgressUpload = require('./routes/project_progress_upload');
const piutangs = require('./routes/piutangs');
const piutangUpload = require('./routes/piutang_upload');
const projections = require('./routes/projections');
const projectionUpload = require('./routes/projection_upload');
const cashFlows = require('./routes/cash_flows');
const cashFlowUpload = require('./routes/cash_flow_upload');
const bads = require('./routes/bads');
const badUpload = require('./routes/bad_upload');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.use('/api/security', security);
app.use('/api/users', users);
app.use('/api/roles', roles);
app.use('/api/projects', projects);
app.use('/api/projecttypes', projectTypes);
app.use('/api/projectprogresses', projectProgresses);
app.use('/api/projectprogressupload', projectProgressUpload);
app.use('/api/piutangs', piutangs);
app.use('/api/piutangupload', piutangUpload);
app.use('/api/projections', projections);
app.use('/api/projectionupload', projectionUpload);
app.use('/api/cashFlows', cashFlows);
app.use('/api/cashFlowupload', cashFlowUpload);
app.use('/api/bads', bads);
app.use('/api/badupload', badUpload);

app.listen(3300);
