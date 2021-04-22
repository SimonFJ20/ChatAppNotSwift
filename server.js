const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const api = require('./api');

const server = express();

const port = parseInt(process.env.HTTP_PORT);

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.use('/api', api);

server.use(express.static(path.join(__dirname, './public')));

server.listen(port, () => {
    console.log('Express HTTP on port', port);
});