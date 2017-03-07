var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017');

var CartItemX = require('./models/cartitemx');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/cartitemx')

    .post(function(req, res){
        var itemx = new CartItemX();
        itemx.cart = req.body.cart;
        itemx.donation = req.body.donation;

        itemx.save(function(err){
            if (err)
                res.send(err);
            res.json(req.body);
        });
    });

router.route('/listcartitemx')
    .get(function(req, res){
        CartItemX.find(function(err, items){
            if (err)
                res.send(err);
            res.json(items);
        })
    });


//====Start ShoppingCart.GetTotal=============

router.route('/shoppingcartx/gettotal/before')
    .post(function(req, res){
        var result = {
            callback: {
                body: {items: 'this.GetCartItems()'},
                function: '/compute',
            },
            comment: 'what is that?'
        }
        res.json(result)
    });

router.route('/shoppingcartx/gettotal/compute')
    .post(function(req, res){
        var items = req.body.items;
        var total = 0;
        var counted = items.length
        items.forEach(function(item){
            id = item.CartItemId
            CartItemX.findOne({cart: id}, function(err, result){
                console.log(result);
                if(err || (! result)) 
                    item.donation = 0;
                else 
                    item.donation = result.donation;
                total = total + item.Count * item.Album.Price * (1 + item.donation);
                
                if(--counted == 0){
                    var result = {
                        returnx: total
                    }
                    res.json(result)
                }
            }); 
        });
    });

//=====End ShoppingCart.GetTotal==============

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
