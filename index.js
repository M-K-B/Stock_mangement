const express = require('express');
const { engine } = require('express-handlebars');
const db = require('./db');
const session = require('express-session');
const router = require('./routes')
const dotenv = require('dotenv')
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

dotenv.config = ({path : './env'})
const PORT = 8080;
const secretkey = process.env.SECRET_KEY;
//require('dotenv').config()
app.use(cookieParser());

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using https
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');



app.use(router);


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})