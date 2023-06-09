require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3333;
const db = require('./config/connection.js');
const session = require('express-session');
const is_prod = process.env.PORT;
const path = require('path');

const api_routes = require('./routes/api_routes.js');
const auth_routes = require('./routes/auth_routes.js');

const app = express();

app.use(express.static('../client/build'));

app.use(express.json());

if (is_prod) {
  app.enable('trust proxy');
  };

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.PORT ? true : false }
}));

app.use('/api', api_routes);
app.use('/auth', auth_routes);

if (is_prod) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), '../client/build/index.html'));
  });
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log('Server listening on port %s', PORT);
  })
});