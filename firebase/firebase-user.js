var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

// Initialize Firebase
const config = {
    apiKey: "<API KEY>",
    authDomain: "<DOMAIN>",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
//firebase.initializeApp(config);
const mFirebase = firebase.initializeApp(config);
const database = mFirebase.database();

//SignUp with Email and Password
function createEmailUser(email, password, callback){
    mFirebase.auth().createUserWithEmailAndPassword(email, password).then(callback()).catch(function(error){
        console.log(error);
    });
}

//Login with email and password
function loginWithEmail(email, password, callback){
    mFirebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(usercred){
        //usercred.user.getUid();
        console.log("LoggedIn");
        callback();
    })
    .catch(function(error){
        console.log(error);
        callback(error);
    });
}

//Logout of firebase account
function logout(){
    mFirebase.auth().signOut();
}

//Get Uid
function getUid(){
    return mFirebase.auth().currentUser.uid;
}

//Check Login status
function isLoggedIn(req, res, next){
    //var user = mFirebase.auth().currentUser;
    if(req.session.uid && req.session.type == 'user'){
        return next();
    }
    else{
        res.redirect('/user/login');
    }
}

//Check Login status for login page
function checkLoginPage(req, res, next){
    //var user = mFirebase.auth().currentUser;
    if(req.session.uid == null){
        return next();
    }
    else{
        res.redirect('/user/dashboard');
    }
}

//DB methods

//Add Certificate to database
function addCertToDb(data, callback){
    console.log(data);
    var dataref = database.ref('/certificates').push();
    dataref.set(data, function(err){
        if(err){
            console.log(err);
        } else {
            callback();
        }

    });
}

//Get certificates list from db
function getCertListFromDb(uid, callback){
    var dataref = database.ref('/certificates');
    var arr = [];
    dataref.once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if(childData.uid == uid){
                arr.push(childData);
            }
          }); 
          callback(arr);       
    });
}

//Get all certificates
function getCertFromAddress(address, callback){
    var dataref = database.ref('/certificates');
    dataref.once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if(childData.address == address){
                callback(childData);
                return;
            }
          });   
    });
}

//Add notification
function addNotification(data){
    console.log(data);
    var dataref = database.ref('/notifications').push();
    dataref.set(data, function(err){
        if(err){
            console.log(err);
        }
    });
}

function getNotifications(uid, callback){
    var dataref = database.ref('/notifications');
    var arr = [];
    dataref.once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if(childData.uid == uid){
                arr.push(childData);
            }
          });  
          callback(arr); 
    });
}

module.exports = {createEmailUser: createEmailUser, loginWithEmail: loginWithEmail, isLoggedIn: isLoggedIn, 
    checkLoginPage: checkLoginPage, logout: logout, addCertToDb: addCertToDb, getCertListFromDb: getCertListFromDb,
    getUid: getUid, getCertFromAddress: getCertFromAddress, addNotification: addNotification, getNotifications: getNotifications};