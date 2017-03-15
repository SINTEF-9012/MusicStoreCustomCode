var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var mongoose = require('mongoose')

mongoose.connect('mongodb://mongo:27017');
//mongoose.connect('mongodb://127.0.0.1:27017');

var Schema = mongoose.Schema;
var CartItemXSchema = new Schema({
    cart: Number,
    donation: Number
})
var CartItemX = mongoose.model('Donation', CartItemXSchema);

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
            res.json(body)
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
                body: {items: '$this.GetCartItems().Result'},
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
		    total = Number(total.toFixed(4));
                    var result = {
                        returnx: total
                    }
                    res.json(result)
                }
            }); 
        });
    });

//=====End ShoppingCart.GetTotal==============

//=====Begin of ShoppingCartController.AddItem=======================
router.route('/shoppingcartcontrollerx/additem/after')
    .post(function(req, res){
        var formstr = "<html><body> \
        <form action='{0}/donate' method='post'> \
        <label>How much would you like to donate to help poor Chinese children?</label> </br>\
        <input type='hidden' name='itemid' value='{1}' /> \
        <input type='hidden' id = 'wherefrom' name='wherefrom' value='' />\
        <input type='range' name='donation' step='0.01' min='0' max='1'/> </br> \
        <button type='submit'>Submit</button> \
        <script>document.getElementById('wherefrom').value = window.location.href;</script> \
        </form></body></html>"
        var result = {
            context: {
                str_form: formstr,
                str_contenttype: "text/html",
                newitem: "$cart.GetCartItems().Result.FirstOrDefault(AlbumId == $id)",
                form: "String.format($str_form, $endpoint, $newitem.CartItemId.ToString())",
                content: "$this.Content($form)",
                _void: "SET $content.ContentType = $str_contenttype"
            },
            returnx: "$content"
        };
        res.json(result);
    });

router.route('/shoppingcartcontrollerx/additem/donate')
    .post(function(req, res){
        var itemx = new CartItemX();
        itemx.cart = req.body.itemid;
        itemx.donation = req.body.donation;
        wherefrom = req.body.wherefrom
        wherefrom = wherefrom.substring(0, wherefrom.lastIndexOf("/"))
        wherefrom = wherefrom.substring(0, wherefrom.lastIndexOf("/"))
        itemx.save(function(err){
            if (err)
                res.send(err);
            res.writeHead(301, {Location: wherefrom});
            res.end();
        });

    })

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
