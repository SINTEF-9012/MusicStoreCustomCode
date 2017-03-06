var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DonationSchema = new Schema({
    cart: Number,
    proportion: Number
})

module.exports = mongoose.model('Donation', DonationSchema)