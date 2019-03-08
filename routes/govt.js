const express     = require('express'),
      router      = express.Router(),
      web3Helper  = require('../contracts/web3Helper');

const signoutlink = '/govt/logout';

router.get('/login', function(req, res){
    res.send('Govt Login');
});

router.get('/:address/:account', function(req, res){
    web3Helper.revoke(req.params.address, req.params.account, function(){
        res.send('Revoke Request Successful!');
    });
});

module.exports = router;