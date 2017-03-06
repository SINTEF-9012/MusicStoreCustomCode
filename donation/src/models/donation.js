var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DonationSchema = new Schema({
    cartId: Number,
    prop: Number
})

module.exports = mongoose.model('Donation', DonationSchema)