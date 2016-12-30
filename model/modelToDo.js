var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoschema = new Schema({
    date            : Date,
    activity        : String,
    fname           : String,
    lname           : String,
    status          : String
});

module.exports = mongoose.model('todos', todoschema);