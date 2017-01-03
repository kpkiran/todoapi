var express = require('express');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var TodoList = require('./model/modelToDo');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var app = express();

//Set the view engine
app.set('view engine', 'ejs');

// Implementing body parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());

// Implementing express validator
app.use(expressValidator());

// Connecting to the database
var url = mongoose.connect('mongodb://localhost/TodoDb');

app.get('/todo', function (req, res) {
    res.render('index');
});

// app.get('/todo', function(req, res){
//     TodoList.find(function(err, todolists){
//         if(err){
//             res.status(404);
//             res.send('Data not found');
//         } else {
//             res.status(200);
//             res.send(todolists);
//         }
//     });
// });


// Posting data to the database
app.post('/todo', urlencodedParser, function (req, res) {

    req.checkBody("date", "Enter a valid date").isDate();
    req.checkBody("activity", "Enter a valid activity").isAlpha().isLowercase();
    req.checkBody("fname", "Enter a valid first name").isAlpha().isLowercase();
    req.checkBody("lname", "Enter a valid last name").isAlpha().isLowercase();
    req.checkBody("status", "Enter a valid status").isAlpha().isLowercase();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.send(errors);
        return;
    } else {
        var todo = new TodoList(req.body);
        console.log(todo);
        todo.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200);
                res.render('success');
            }
        });
    }
});

app.get('/tododetails', function (req, res) {
    res.render('displaydetails', { data: true });
});

app.post('/tododetails', urlencodedParser, function (req, res) {
    var query = {};

    req.checkBody('idInput', 'ID cannot be empty').notEmpty();
    if (req.body) {
        query.id = req.body.idInput;
    }

    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        TodoList.find({ "_id": query.id }, function (err, data) {
            console.log(data);
            if (err) throw err;
            res.render('displaydetails', { data: data });
        });
    }
});

app.delete('/delete', function (req, res) {
    TodoList.findById(req.body.id, function (err, data) {
        data.remove(function (err) {
            if (!err) {
                res.status(200);
                res.send('Removed');
            }
        });
    });
});

app.listen(3000);