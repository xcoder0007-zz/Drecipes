// including DB Config file 
let config = require('./config');
config = config.config;

let express = require('express'),
  path = require("path"),
  bodyParser = require('body-parser'),
  cons = require('consolidate'),
  dust = require('dustjs-helpers'),
  pg = require('pg'),
  app = express();


let pool = new pg.Pool(config);


// Assign Dust as Engine To .Dust Files 
app.engine('dust', cons.dust);

// Set Default Ext .Dust 
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');


// Set Public Folder 
app.use(express.static(path.join(__dirname, 'public')));


//Body Parser Middleware 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));



// Router 
app.get('/', function (req, res) {

  // connect to our database
  pool.connect(function (err, client, done) {
    if (err) throw err;

    // execute a query on our database
    client.query("SELECT * FROM recipes", function (err, result) {
      //call `done()` to release the client back to the pool
      done();

      if (err) {
        return console.error('error running query', err);
      }

      res.render('index', { recipes: result.rows })

    });
  });
})


// Add new recipe 

app.post('/add',function(req,res){


    // connect to our database
  pool.connect(function (err, client, done) {
    if (err) throw err;

    // execute a query on our database
    client.query("INSERT INTO recipes (title, ingredients, directions) VALUES ($1,$2,$3)"
    ,[req.body.title,req.body.ingredients,req.body.directions])

    done();
    res.redirect('/')
  });


  
  
})


pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})


// Server 

app.listen(3000, function () {
  console.log('Server listen on port 3000');
})