var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartItemXSchema = new Schema({
    cart: Number,
    donation: Number
})

module.exports = mongoose.model('Donation', CartItemXSchema)