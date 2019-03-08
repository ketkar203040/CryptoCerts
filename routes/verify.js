const express     = require('express'),
      router      = express.Router(),
      signature   = require('../modules/signature'),
      fs          = require('fs'),
      web3Helper  = require('../contracts/web3Helper'),
      multer      = require('multer');

const upload      = multer({ dest: 'temp/' });

router.get('/', function(req, res){
    res.render('verify', {title: 'Verify', signoutlink: ''});
});

router.post('/', upload.single('verifyfile'), function(req, res){
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
            //Get contract from account no
            web3Helper.getDeployedContract(fileJson.address, function(data){
                if(!data){
                    //return res.send('Certificate not Found!!');
                    return res.render('verify', {title: 'Verify', status: 0, signoutlink: '', data: data});
                }
                var dataStr = data.name + data.degree + data.college + data.score + data.batch;
                console.log('Datastr' + dataStr);
                //Verify certificate
                signature.verifySign(dataStr, fileJson.publickey, data.sign, function(verify){
                    console.log(verify);
                    if(verify == true && data.validity == true){
                        res.render('verify', {title: 'Verify', status: 1, signoutlink: '', data: data, address: fileJson.address});
                    } 
                    else if(data.validity == false){
                        //res.send('Certificate Revoked');
                        res.render('verify', {title: 'Verify', status: -1, signoutlink: '', data: data});
                    }
                    else {
                        res.render('verify', {title: 'Verify', status: 0, signoutlink: '', data: data});
                    }
                });
            });
        });
    } else {
        console.log('File upload failed');
    }
});


module.exports = router;