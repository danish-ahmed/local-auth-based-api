var express = require('express');
var User = require('./models/user')
var apiRouter = express.Router();
jwt = require('jsonwebtoken');
var config = require('./config');

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRouter.post('/authenticate', (req, res) => {
    User.findOne({
        name:req.body.name,
    }, (err, user) => {
        if(err) throw err;
        if(!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if(user){
            if(user.password != req.body.password){
                res.json({success:false, message: "Authentication Failed. Wrong Password"})
                console.log(req.body, user)
            }else{
                const paylod = {
                    admin: user.admin
                };
                var token = jwt.sign(paylod, config.secret, { 
                    
                })
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    })
})

// TODO: route middleware to verify a token
apiRouter.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err){
                return res.json({success: false, message:"failed to authenticate"})
            } else{
                req.decoded = decoded;
                next()
            }
        })
    } else {
        return res.status(403).send({
            success:false,
            message: 'No token provided'
        })
    }
})

// route to show a random message (GET http://localhost:8080/api/)

apiRouter.get('/', (req, res, next) => {
    res.json('WELCOME TO ONE OF THE COOLEST API')
})
// route to return all users (GET http://localhost:8080/api/users)
apiRouter.get('/users', (req, res, next) => {
    User.find({}, (err, users) => {
        if(err){ throw err}
        if(users){ res.json(users) }
    })
})

module.exports = apiRouter