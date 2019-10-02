const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const key = require('./config/keys')
const bcrypt = require('bcryptjs');

mongoose.connect(key.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
require('./models/user.schema.js');
let User = mongoose.model('User');


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello");
});

app.post('/api/register', (req, res) => {
    User.findOne({ email: req.body.email }, (err, email) => {
        if (email) {
            res.send("El Email ya esta registrado");
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                new User({
                    fullname: req.body.fullname,
                    address: req.body.adress,
                    city: req.body.city,
                    municipio: req.body.municipio,
                    postalCode: req.body.postalCode,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: hash
                }).save();
                res.send("Data Saved");
            });

        }
    });
});


app.post('/api/login', (req,res)=> {
    User.findOne({ email: req.body.email }, (err, person) => {
        if (!person) {
          res.send('Usuario y/o Contraseña incorrectas')
        } else {
          bcrypt.compare(req.body.password, person.password, (err, response) => {
            if (response) {
              jwt.sign({ email: person.email }, key.jwtSecret, (err, authToken) => {
                res.cookie('jwtToken', authToken, {maxAge: 1600000000});
                res.send("Estas autenticado con el ID: " + authToken + "Tu Numero de Usuario es: " + person.id);
              });
            } else {
              res.send("Authorizacion Denegada");
            }
          });
        }
      });
});

app.listen(3000, () => console.log('Servidor iniciado puerto 3000'));