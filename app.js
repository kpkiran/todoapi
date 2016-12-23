var express             = require('express');
var mongoose            = require('mongoose');
var mongo               = require('mongodb');
var TodoList            = require('./model/modelToDo');
var bodyParser          = require('body-parser');
var expressValidator    = require('express-validator');
var app = express();

app.set('view engine', 'ejs');

var urlencodedParser = bodyParser.urlencoded({extended: true});
app.use(bodyParser.json());
app.use(expressValidator());

var url = mongoose.connect('mongodb://localhost/TodoDb');

app.get('/todo', function(req, res){
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
                res.send('Successfully Inserted Data');
            }
        });
    }
});

// app.get('/todo/:id', function(req, res){
//     TodoList.findById(req.params.id, function(err, todolists){
//         if(err){
//             res.status(404);
//             res.send('Cannot find record');
//         } else {
//             res.status(200);
//             res.send(todolists);
//         }
//     });
// });

// app.delete('/todo', function(req, res){
//     TodoList.findById(req.body._id, function(err, todolists){
//         TodoList.remove(function(err){
//             if(!err){
//                 res.status(204);
//                 res.send('Removed');
//             }
//         });
//     });
// });

app.listen(3000);