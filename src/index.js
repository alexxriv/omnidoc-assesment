const express = require("express");
const morgan = require("morgan");
const {engine} = require("express-handlebars");
const path = require("path");
const flash = require('connect-flash');
const session = require("express-session");
const MYSQLSTORE = require('express-mysql-session');
const passport = require('passport');


const {database}=require('./keys');

//Inicializaciones
const app = express();
require('./lib/passport');

//config
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
  })
);
app.set('view engine', '.hbs');

//Middleware
app.use(session({
  secret: 'cashSession',
  resave: false,
  saveUninitialized: false,
  store: new MYSQLSTORE(database),

}))
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req,res,next) =>{
  app.locals.success =  req.flash('success');
  app.locals.message =  req.flash('message');
  app.locals.user = req.user;
  next();
})

// Routes
app.use(require("./routes"));

app.use(require('./routes/authentication'));



// Public
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
