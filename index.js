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


    if ((bidprice * bidqty <= req.session.cash) && (/(^[0-9]+[.][0-9]+)$|^[\d+]$/.test(bidprice)) && (/^\d+$/.test(bidqty))) { // check the wallet and do the validation


        // CONTROLLA SE QUALCUNO VENDE AL MIO PREZZO DI ACQUISTO:
        var fileask = __dirname + '/mocks/ask.json';
        var esisteask = 0;
        var asks = JSON.parse(fs.readFileSync(fileask, 'utf8'));
        var fileuser = __dirname + '/mocks/users.json';
        var users = JSON.parse(fs.readFileSync(fileuser, 'utf8'));
        var ii = 0;
        while ((asks[ii]) && (bidqty > 0)) {
            if (asks[ii].price == bidprice) {
                console.log('qualcuno vende al mio prezzo di acquisto');
                esisteask = 1;

                if (asks[ii].qty > bidqty) {

                    asks[ii].qty = asks[ii].qty - bidqty;
                    req.session.cash = req.session.cash - (bidprice * bidqty);
                    req.session.shares = req.session.shares + bidqty;


                    // AGGIORNO WALLET:
                    console.log('aggiorno wallet');

                    var iuser = 0;
                    while (users[iuser]) {

                        if (users[iuser].id == req.session.userid) { // ACQUIRENTE    
                            users[iuser].wallet.cash = users[iuser].wallet.cash - (bidprice * bidqty);
                            users[iuser].wallet.shares = users[iuser].wallet.shares + bidqty;
                        } else if (users[iuser].id == asks[ii].userid) { // VENDITORE     
                            users[iuser].wallet.shares = users[iuser].wallet.shares - bidqty;
                            users[iuser].wallet.cash = users[iuser].wallet.cash + (bidprice * bidqty);
                        }
                        iuser++;
                    }
                    bidqty = 0;
                    break; // esce dal ciclo perche ho comprato tutto quello che volevo comprare


                } else if (asks[ii].qty <= bidqty) {

                    req.session.cash = req.session.cash - (bidprice * asks[ii].qty);
                    req.session.shares = req.session.shares + asks[ii].qty;
                    bidqty = bidqty - asks[ii].qty;

                    // AGGIORNO WALLET:
                    console.log('aggiorno wallet');
                    var iuser = 0;

                    while (users[iuser]) {

                        if (users[iuser].id == req.session.userid) { // ACQUIRENTE               
                            users[iuser].wallet.cash = users[iuser].wallet.cash - (bidprice * asks[ii].qty);
                            users[iuser].wallet.shares = users[iuser].wallet.shares + asks[ii].qty;
                        } else if (users[iuser].id == asks[ii].userid) { // VENDITORE       
                            users[iuser].wallet.shares = users[iuser].wallet.shares - asks[ii].qty;
                            users[iuser].wallet.cash = users[iuser].wallet.cash + (bidprice * asks[ii].qty);
                        }
                        iuser++;
                    }
                    asks.splice(ii, 1);

                }



            }
            ii++;
        }
        fs.writeFileSync(fileuser, JSON.stringify(users, null, 4));
        fs.writeFileSync(fileask, JSON.stringify(asks, null, 4));


        // OFFERTA DI ACQUISTO REGISTRATA SUL BOOK PERCHE NESSUNO VENDE AL MIO PREZZO DI ACQUISTO:
        if ((!esisteask) || ((esisteask) && (bidqty > 0))) {
            var filebid = __dirname + '/mocks/bid.json';
            var bids = JSON.parse(fs.readFileSync(filebid, 'utf8'));
            bids.push({
                "id": idbid++,
                "userid": req.session.userid,
                "qty": bidqty,
                "price": bidprice
            });

            fs.writeFileSync(filebid, JSON.stringify(bids, null, 4));
        }


        res.json({
            ok: 'yes',            
            cash: req.session.cash,
            shares: req.session.shares
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
    
    if ((askprice * askqty <= req.session.shares) && (/(^[0-9]+[.][0-9]+)$|^[\d+]$/.test(askprice)) && (/^\d+$/.test(askqty))) { // check the wallet and do the validation    



        // CONTROLLA SE QUALCUNO VUOLE COMPRARE AL MIO PREZZO DI VENDITA:
        var filebid = __dirname + '/mocks/bid.json';
        var esistebid = 0;
        var bids = JSON.parse(fs.readFileSync(filebid, 'utf8'));
        var fileuser = __dirname + '/mocks/users.json';
        var users = JSON.parse(fs.readFileSync(fileuser, 'utf8'));
        var ii = 0;
        while ((bids[ii]) && (askqty > 0)) {
            if (bids[ii].price == askprice) {
                console.log('qualcuno vuole comprare al mio prezzo di vendita');
                esistebid = 1;
                if (bids[ii].qty > askqty) {

                    bids[ii].qty = bids[ii].qty - askqty;
                    req.session.cash = req.session.cash + (askprice * askqty);
                    req.session.shares = req.session.shares - askqty;


                    // AGGIORNO WALLET:
                    console.log('aggiorno wallet');

                    var iuser = 0;
                    while (users[iuser]) {
                        if (users[iuser].id == req.session.userid) { // VENDITORE    
                            users[iuser].wallet.cash = users[iuser].wallet.cash + (askprice * askqty);
                            users[iuser].wallet.shares = users[iuser].wallet.shares - askqty;
                        } 
                        if (users[iuser].id == bids[ii].userid) { // ACQUIRENTE     
                            users[iuser].wallet.shares = users[iuser].wallet.shares + askqty;
                            users[iuser].wallet.cash = users[iuser].wallet.cash - (askprice * askqty);
                        }
                        iuser++;
                    }
                    askqty = 0;
                    break; // esce dal ciclo perche ho venduto tutto quello che volevo vendere


                } else if (bids[ii].qty <= askqty) {
                     
                    req.session.cash = req.session.cash + (askprice * bids[ii].qty);
                    req.session.shares = req.session.shares - bids[ii].qty;
                    askqty = askqty - bids[ii].qty;

                    // AGGIORNO WALLET:
                    console.log('aggiorno wallet');
                    var iuser = 0;

                    while (users[iuser]) {
                        console.log('test 4');
                        if (users[iuser].id == req.session.userid) { // VENDITORE              
                            users[iuser].wallet.cash = users[iuser].wallet.cash + (askprice * bids[ii].qty);
                            users[iuser].wallet.shares = users[iuser].wallet.shares - bids[ii].qty;
                        }
                        if (users[iuser].id == bids[ii].userid) { // ACQUIRENTE      
                            users[iuser].wallet.shares = users[iuser].wallet.shares + bids[ii].qty;
                            users[iuser].wallet.cash = users[iuser].wallet.cash - (askprice * bids[ii].qty);
                        }
                        iuser++;
                    }
                    bids.splice(ii, 1);

                }



            }
            ii++;
        }
        fs.writeFileSync(fileuser, JSON.stringify(users, null, 4));
        fs.writeFileSync(filebid, JSON.stringify(bids, null, 4));

        // OFFERTA DI VENDITA REGISTRATA SUL BOOK PERCHE NESSUNO VUOLE COMPRARE AL MIO PREZZO DI VENDITA:
        if ((!esistebid) || ((esistebid) && (askqty > 0))) {
            var fileask = __dirname + '/mocks/ask.json';
            var asks = JSON.parse(fs.readFileSync(fileask, 'utf8'));
            asks.push({
                "id": idask++,
                "userid": req.session.userid,
                "qty": askqty,
                "price": askprice
            });
            fs.writeFileSync(fileask, JSON.stringify(asks, null, 4));
        }


        res.json({
            ok: 'yes',         
            cash: req.session.cash,
            shares: req.session.shares
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

    } else { // validaziono non andata a buon fine:

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
