//require all modules
let express = require('express');//to create web apps
var exphbs = require('express-handlebars');//to render templates
const bodyParser = require('body-parser');//require body parser for htm functionality
const flash = require('express-flash');
const session = require('express-session');
let Waiters = require("./waiters");
// const Routes = require('./routes')

const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://kagiso:123@localhost:5432/waiters';
const pool = new Pool({
    connectionString
});
let app = express();


//instantiate 

var waiters = Waiters(pool)
// initialise session middleware - flash-express depends on it
//setup handlebars ,Body-parser and public
app.engine('handlebars', exphbs({ layoutsDir: './views/layouts' }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

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
app.get('/', async function (req, res) {
    res.render('home')
})


app.get('/waiters', async function (req, res) {
    const day = await waiters.days()
    const days = req.body.days

    res.render('waiters', {
        day
    })

})

app.post('/waiters', async function (req, res) {
    const day = await waiters.days()
    const days = req.body.days

    if (days === undefined) {
        req.flash('error', 'Please input your name in the url and select workings days above!')
    }else if(days.length < 3){
        req.flash('error', 'Please select 3 workings days!')

    }

    // if (days.length < 3) {
    //     req.flash('error', 'Please select 3 days!')
    // }

    res.render('waiters', {
        day
    })

})

//Show waiters a screen where they can select the days they can work
app.get('/waiters/:username', async function (req, res) {
    const days = req.body.days
    const day = await waiters.days()
    const user = req.params.username


    await waiters.addName(user)

    await waiters.waiterShift(user)

    var uid = await waiters.getUserId(user)
    const personShift = await waiters.eachShifts(uid)

    day.forEach(element => {
        personShift.forEach(eachPers => {
            if (eachPers.days_selected === element.id) {
                element.state = "checked"
            }
        })
    });

    res.render('waiters', {
        day,
        name: user
    })
})


app.post('/waiters/:username', async function (req, res) {
    const user = req.params.username
    const days = req.body.days

    if (days == undefined) {
        req.flash('error', 'Please select workings days above!')
    }else if(days.length < 3){
        req.flash('error', 'Please select 3 workings days!')

    }

    await waiters.addName(user)
    await waiters.addShift(user, days)

    const day = await waiters.waiterShift(user)
    var uid = await waiters.getUserId(user)
    await waiters.eachShifts(uid)
    res.render('waiters', {
        name: user,
        day,

    })
})

app.get('/admin', async function (req, res) {
    const day = await waiters.days()
    const shifts = await waiters.shiftsSelected()


    res.render('admin', {
        day,
        shifts
    })
})

app.get('/reset', async function (req, res) {
    const day = await waiters.days()
    const shifts = await waiters.shiftsSelected()


    await waiters.reset()
    res.render('admin', {
        day,
        shifts
    })
})


//Port setup
const PORT = process.env.PORT || 8002;

app.listen(PORT, function () {
    console.log('App starting on port :' + PORT);
});