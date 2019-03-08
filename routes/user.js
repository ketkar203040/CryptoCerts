const express     = require('express'),
      router      = express.Router(),
      fHelper     = require('../firebase/firebase-user'),
      fIHelper    = require('../firebase/firebase-issuer'),
      web3Helper  = require('../contracts/web3Helper'),
      mailer      = require('../modules/mailer'),
      fileHandler = require('../modules/file-handler');

const signoutlink = '/user/logout';

router.get('/login', fHelper.checkLoginPage, function(req, res){
    res.render('login', {title: 'User', action: '/user/login', signoutlink: ''});
});

router.post('/login', function(req, res){
    fHelper.loginWithEmail(req.body.email, req.body.password, function(err){
        if(err){
            return res.send('Invalid Credentials!!');
        }
        req.session.uid = fHelper.getUid();
        req.session.type = 'user';
        res.redirect('/user/dashboard'); 
    });
});

router.get('/logout', function(req, res){
    fHelper.logout();
    req.session.uid = null;
    req.session.type = null;
    res.redirect('/');
});

router.get('/signup', function(req, res){
    res.render('usersignup', {title: 'User', signoutlink: ''});
});

router.post('/signup', function(req, res){
    fHelper.createEmailUser(req.body.email, req.body.password, function(){
        res.redirect('/user/login');
    });
});


router.get('/dashboard', fHelper.isLoggedIn, function(req, res){
    fHelper.getCertListFromDb(req.session.uid, function(certs){
        res.render('userdash', {title: 'Dashboard', certs: certs, signoutlink: signoutlink});
    });
});

router.get('/cert/:address', fHelper.isLoggedIn, function(req, res){
    web3Helper.getDeployedContract(req.params.address, function(cert){
        cert.downloadlink = req.params.address + '/downloadverify/'; 
        res.render('certificate2', {title: 'Certificate', signoutlink: signoutlink, cert: cert});
    });
});

router.get('/cert/add/:address/:issueruid', fHelper.isLoggedIn, function(req, res){
    var address = req.params.address;
    web3Helper.getDeployedContract(address, function(data){
        console.log(data);
        fIHelper.getKeysFromDb(req.params.issueruid, function(keys){
            var pubKey = keys.PUBLIC;
            var dbData = {issuer: data.college, degree: data.degree, address: address, PUBLIC: pubKey, uid: req.session.uid};
            web3Helper.setUserAddress(address, 5, function(success){
                if(!success){
                    return res.send('Could not connect the certificate!!!')
                }
                else{
                    fHelper.addCertToDb(dbData, function(){
                        res.redirect('/user/dashboard');
                    });
                }
            });
            // fHelper.addCertToDb(req.session.uid, dbData, function(){
            //     res.redirect('/user/dashboard');
            // });
        });
        
    });
});

router.get('/cert/:address/downloadverify', fHelper.isLoggedIn, function(req, res){
    fHelper.getCertListFromDb(req.session.uid, function(certs){
        certs.forEach(function(cert){
            if(cert.address == req.params.address){
                var data = {address: cert.address, publickey: cert.PUBLIC};
                fileHandler.createVerifyFile(data, function(){
                    res.download('./temp/verify.json');
                    //fileHandler.deleteVerifyFile();
                });
            }
        });
    });
});

//Revoke
router.get('/:address/:account', fHelper.isLoggedIn, function(req, res){
    web3Helper.revoke(req.params.address, 5, function(){
        res.send('Revoke Request Successful!');
    });
});

//Request View
router.post('/requestCertView/:address', function(req, res){
    fHelper.getCertFromAddress(req.params.address, function(cert){
        console.log(cert);
        var data = {uid: cert.uid, address: req.params.address, email: req.body.email, org: req.body.name, degree: cert.degree}
        fHelper.addNotification(data);
        res.redirect('/');
    });
});

router.get('/notification', fHelper.isLoggedIn, function(req, res){
    fHelper.getNotifications(req.session.uid, function(notifiations){
        res.render('notifications',  {title: 'Notifications', signoutlink: signoutlink, data: notifiations});
    });
});

router.get('/render/:address/:email', function(req, res){
    web3Helper.getDeployedContract(req.params.address, function(cert){
        res.render('certprint', {cert: cert}); 
    });
});

router.get('/share/:address/:email', function(req, res){
   mailer.sendCertToReq(req.params.email, 'http://192.168.137.86:5456/user/render/' + req.params.address + '/' + req.params.email);
   res.redirect('/user/dashboard');
});

module.exports = router;