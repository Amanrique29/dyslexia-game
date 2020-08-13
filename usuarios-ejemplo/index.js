const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect(
    'mongodb://localhost:27017',
    function (err, client) {
        db = client.db('tienda');
    }
);
const session = require('express-session');
app.use(session(
    {
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    }
));
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
const LocalStrategy = require('passport-local').Strategy;
passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        function (email, password, done) {
            db.collection('users').find({ email: email }).toArray(function (err, users) {
                if (users.length === 0) {
                    return done(null, false);
                }
                const user = users[0];
                if (password === user.password) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);
passport.serializeUser(function (user, done) {
    done(null, user.email);
});
passport.deserializeUser(function (id, done) {
    db.collection('users').find({ email: id }).toArray(function (err, users) {
        if (users.length === 0) {
            done(null, null);
        }
        done(null, users[0]);
    });
});
app.use(express.json());
app.post('/api/register', function (req, res) {
    db.collection('users').insertOne({
        name: req.body.nombre,
        email: req.body.email,
        password: req.body.password
    },
    function(err, datos) {
        res.send({mensaje: 'registrado'});
    })
});
app.post('/api/login', passport.authenticate('local', {
    successRedirect: '/api',
    failureRedirect: '/api/fail'
}));
app.get('/api/fail', function(req, res) {
    res.status(401).send({mensaje: 'denegado'})
});
app.get('/api', function (req, res) {
    if (req.isAuthenticated() === false) {
        return res.status(401).send({mensaje: 'necesitas loguearte'});
    }
    res.send({mensaje: 'logueado correctamente'});
});
app.get('/api/user', function(req, res) {
    if(req.isAuthenticated()) {
        return res.send({nombre: req.user.name});
    }
    res.send({nombre: 'No logueado'});
})
app.listen(3001);