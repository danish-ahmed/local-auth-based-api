var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('body-parser'),

    jwt = require('jsonwebtoken'),    
    config = require('./config'),
    User = require('./models/user')

    apiRouter = require('./apiPouter');

var app = express();
// Configuration
var port = process.env.port || 3000;
mongoose.connect(config.database);


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
})

app.get('/setup', (req, res, next) => {
    var nick = new User({
        name: 'Nick Cerminara', 
        password: 'password',
        admin: true 
    });
    nick.save((err) => {
        if(err){
            throw err;
        }
        console.log('User Saved Successfully');
        res.json({success: true})
    })
})


app.use('/api', apiRouter);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);