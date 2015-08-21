var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var sha1 = require('sha1');

var idbid = 3000001; // usato come id autoincrementale per i mock object bid
var idask = 1000001; // usato come id autoincrementale per i mock object ask




// presume a json, if a content type has not been explicitely defined by the user
app.use(function(req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
});

// configure app to use bodyParser()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'ssshhhhh',
    resave: true,
    saveUninitialized: false
}));
app.use(express.static('html')); // Specifico la cartella con i file statici: css, immagini, ecc




// Single Page App with Bootstrap and AngularJS:
// =============================================================================
app.get('/spa', function(req, res) {

    res.sendFile('spa.html', {
        root: path.join(__dirname, './html')
    });

});




// API RESTful:
// =============================================================================

app.post('/bid', function(req, res) {

    var bidprice = req.body.bidprice;
    var bidqty = req.body.bidqty;

    if ((bidprice * bidqty <= req.session.cash) && (/^[0-9]*[.][0-9]+$/.test(bidprice)) && (/^\d+$/.test(bidqty))) { // check the wallet and do the validation
        console.log(/^\d+$/.test(bidqty));
        var file = __dirname + '/mocks/bid.json';
        var bids = JSON.parse(fs.readFileSync(file, 'utf8'));
        bids.push({
            "id": idbid++,
            "userid": req.session.userid,
            "qty": bidqty,
            "price": bidprice
        });

        fs.writeFileSync(file, JSON.stringify(bids, null, 4));

        // qui bisognerebbe aggiornare il wallet dell utente

        res.json({
            ok: 'yes'
        });
    } else { // non hai abbastanza denaro o validazione non andata a buon fine

        res.json({
            ok: 'no'
        });

    }
});


app.post('/ask', function(req, res) {

    var askprice = req.body.askprice;
    var askqty = req.body.askqty;
    console.log(req.session.share);

    if ((askprice * askqty <= req.session.shares) && (/^[0-9]*[.][0-9]+$/.test(askprice)) && (/^\d+$/.test(askqty))) { // check the wallet and do the validation    
        var file = __dirname + '/mocks/ask.json';
        var asks = JSON.parse(fs.readFileSync(file, 'utf8'));
        asks.push({
            "id": idask++,
            "userid": req.session.userid,
            "qty": askqty,
            "price": askprice
        });

        fs.writeFileSync(file, JSON.stringify(asks, null, 4));

        // qui bisognerebbe aggiornare il wallet dell utente

        res.json({
            ok: 'yes'
        });
    } else { // non hai abbastanza azioni o validazione non andata a buon fine

        res.json({
            ok: 'no'
        });

    }
});



app.post('/login', function(req, res) {
    var username = req.body.username;
    var psw = req.body.password;

    if ((/^[a-z0-9]+$/i.test(username)) && (/^[a-z0-9]+$/i.test(psw))) { // validation

        var file = __dirname + '/mocks/users.json';

        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            data = JSON.parse(data);
            var ii = 0;
            var logged = 0;
            while (data[ii]) {
                if ((data[ii].username == username) && (data[ii].password == sha1(data[ii].salt + psw))) {
                    var sess = req.session;
                    sess.loggedIn = true;
                    sess.userid = data[ii].id;
                    sess.name = data[ii].name;
                    sess.surname = data[ii].surname;
                    sess.cash = data[ii].wallet.cash;
                    sess.shares = data[ii].wallet.shares;
                    sess.username = data[ii].wallet.username;
                    logged = 1;
                    res.json({
                        name: data[ii].name,
                        surname: data[ii].surname,
                        cash: data[ii].wallet.cash,
                        shares: data[ii].wallet.shares
                    });
                    console.log('Loggato: ' + data[ii].name + ' ' + data[ii].surname + ' ' + data[ii].wallet.cash + ' ' + data[ii].wallet.shares);
                    break;
                }

                ii++;
            }


            if (!logged) {
                res.json({
                    loginerror: 'error'
                });
            }



        });

    } else {      // validaziono non andata a buon fine:

        res.json({
            loginerror: 'error'
        });
    }



});


app.get('/logout', function(req, res) {

    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                logged: 'out',
            });
            console.log('logged out');
        }
    });
});



app.get('/iflogged', function(req, res) {
    var sess = req.session;
    if (sess.loggedIn) {
        res.json({
            name: sess.name,
            surname: sess.surname,
            cash: sess.cash,
            shares: sess.shares
        });
        console.log('Loggato: ' + sess.name + ' ' + sess.surname + ' ' + sess.cash + ' ' + sess.shares);
    } else {
        console.log('Non loggato. Inserisci username e password.')
    }
});




app.listen(8080);

module.exports = app;
