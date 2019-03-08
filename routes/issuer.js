const express     = require('express'),
      router      = express.Router(),
      fHelper     = require('../firebase/firebase-issuer'),
      sign        = require('../modules/signature'),
      mailer      = require('../modules/mailer'),
      multer      = require('multer');
      web3Helper  = require('../contracts/web3Helper');

const signoutlink = '/issuer/logout';
const upload      = multer({ dest: 'temp/' });

router.get('/login', fHelper.checkLoginPage, function(req, res){
    res.render('login', {title: 'Issuer', action: '/issuer/login', signoutlink: ''});
});

router.post('/login', function(req, res){
    fHelper.loginWithEmail(req.body.email, req.body.password, function(err){
        // sign.generateKeys(function(pub, pri){
        //     fHelper.addKeysToDb({PUBLIC: pub, PRIVATE: pri});
        // });
        if(err){
            return res.send('Invalid Credentials!!');
        }
        req.session.uid = fHelper.getUid();
        req.session.type = 'issuer';
        res.redirect('/issuer/dashboard'); 
    });
});

router.get('/logout', function(req, res){
    fHelper.logout();
    req.session.uid = null;
    req.session.type = null;
    res.redirect('/');
});

router.get('/dashboard', fHelper.isLoggedIn, function(req, res){
    fHelper.getCertListFromDb(req.session.uid, function(data){
        var count = 0;
        if(data.length > 0){
            data.forEach(function(mdata){
                web3Helper.getValidity(mdata.address, function(validity){
                    mdata.validity = validity;
                    count++;
                    console.log(mdata);
                    if(count == data.length){
                        return res.render('issuerdash', {title: 'Dashboard', data: data, signoutlink:signoutlink});
                    }
                });
                
            });
        } else{
            res.render('issuerdash', {title: 'Dashboard', data: data, signoutlink:signoutlink});
        }
    });
});

router.get('/issueCert', fHelper.isLoggedIn, function(req, res){
    res.render('addcertificate', {title: 'Issue Certificate', signoutlink: signoutlink});
});

router.post('/issueCert', fHelper.isLoggedIn, function(req, res){
    var date = new Date();
    var issuedate = date.getDay().toString + date.getMonth().toString + date.getFullYear().toString;
    var data = {
        id: '345346345645',
        name: req.body.name,
        degree: req.body.degree,
        clg: req.body.clg,
        score: req.body.score,
        batch: req.body.batch,
        issueDate: issuedate,
    }

    var dataStr = req.body.name + req.body.degree + req.body.clg + req.body.score + req.body.batch;
    console.log(dataStr);

    fHelper.getKeysFromDb(req.session.uid, function(keys){
        sign.createSign(dataStr, keys.PRIVATE, function(sign){
            data.sign = sign;
            web3Helper.deploy(data, function(address){
                var dbData = {
                    name: req.body.name,
                    degree: req.body.degree,
                    college: req.body.clg,
                    address: address,
                    //sign: sign,//Remove later
                }
                fHelper.addCertToDb(req.session.uid, dbData);
                mailer.sendCertMail(req.body.email, 'http://192.168.137.86:5456/user/cert/add/' + address + '/' + fHelper.getUid());
                res.redirect('/issuer/dashboard');
            });
        });
    });
});

router.post('/issuecert/bulk', upload.single('bulk'), function(req, res){
    if(req.file){
        console.log(req.file.originalname);
        console.log(req.file.path);
        //Read data from filr
        fs.readFile(req.file.path, 'utf-8', function(err, data){
            //Convert data to JSON format
            //console.log(data);
            var fileJson = JSON.parse(data);
            //Delete file after getting data
            fs.unlink(req.file.path, function(err){
                console.log(err);
            });
            console.log(fileJson);
            //var len = fileJson.length;
            fileJson.forEach(function(cdata){
                var date = new Date();
                var issuedate = date.getDay().toString + date.getMonth().toString + date.getFullYear().toString;
                var data = {
                    id: '345346345645',
                    name: cdata.name,
                    degree: cdata.degree,
                    clg: cdata.clg,
                    score: cdata.score,
                    batch: rcdata.batch,
                    issueDate: issuedate,
                }
            
                var dataStr = cdata.name + cdata.degree + cdata.clg + cdata.score + cdata.batch;
                console.log(dataStr);
            
                fHelper.getKeysFromDb(req.session.uid, function(keys){
                    sign.createSign(dataStr, keys.PRIVATE, function(sign){
                        data.sign = sign;
                        web3Helper.deploy(data, function(address){
                            var dbData = {
                                name: req.body.name,
                                degree: req.body.degree,
                                college: req.body.clg,
                                address: address,
                                //sign: sign,//Remove later
                            }
                            fHelper.addCertToDb(req.session.uid, dbData);
                            mailer.sendCertMail(req.body.email, 'http://192.168.137.86:5456/user/cert/add/' + address + '/' + fHelper.getUid());
                            
                        });
                    });
                });
            });
            
        });
        res.redirect('/issuer/dashboard');
    }else {
        console.log('File upload failed');
    }
});

router.get('/revoke/:address/:account', fHelper.isLoggedIn, function(req, res){
    web3Helper.revoke(req.params.address, 1, function(){
        var govtlink = 'http://localhost:3000/govt/' + req.params.address + '/10';
        var userlink = 'http://localhost:3000/user/' + req.params.address + '/5/';
        mailer.sendGovtRevokeMail('ketkar203040@gmail.com', govtlink);
        mailer.sendUserRevokeMail('ketkar203040@gmail.com', userlink);
        res.send('Revoke request sent!');
    });
});

module.exports = router;