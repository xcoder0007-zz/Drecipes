let config = require('./config');

let express = require('express'),
    path = require("path"),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

 let pool = new pg.Pool(config);
