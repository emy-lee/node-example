var router = require('express').Router();

router.get('/hello', function(req, res) {
    res.json({message: "hello world"});
});

module.exports = router;