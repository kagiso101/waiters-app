//require all modules
let express = require('express');//to create web apps
var exphbs = require('express-handlebars');//to render templates
const bodyParser = require('body-parser');//require body parser for htm functionality
const flash = require('express-flash');
const session = require('express-session');
let Waiters = require('./waiters');
const Routes = require('./routes')

const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://kagiso:123@localhost:5432/waiters';
const pool = new Pool({
    connectionString
});


//instantiate 
let app = express();
var waiters = Waiters(pool)
var routes = Routes(waiters)


//setup handlebars ,Body-parser and public
app.engine('handlebars', exphbs({ layoutsDir: './views/layouts' }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// initialise session middleware - flash-express depends on it
app.use(session({
    secret: 'my express flash string',
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

app.use(express.static('public'));//to use css
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//renders home
app.get('/', routes.home)
app.get('/waiters', routes.waiterGet)
app.post('/waiters', routes.waiterPost)
app.get('/waiters/:username',routes.getDays)
app.post('/waiters/:username', routes.postDays)
app.get('/admin', routes.admin)
app.get('/reset', routes.reset)


//Port setup
const PORT = process.env.PORT || 8002;

app.listen(PORT, function () {
    console.log('App starting on port :' + PORT);
});