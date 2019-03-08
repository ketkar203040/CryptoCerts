"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendCertMail(receiver, link){

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cryptocredsone@gmail.com',
      pass: 'Blocktest@123'
    }
  });
  
  var mailOptions = {
    from: 'cryptocredsone@gmail.com',
    to: receiver,
    subject: 'Link your Certificate',
    text: 'That was easy!',
    html :'<p>Dear User,</p><br><p><a href="' + link + '">Click here</a> to add the certificate to your account. Please do not share this link or email with anyone. Delete this email after adding the certificate to your account.</p></br><p>CryptoCerts Team.<p>',
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
}

//Govt
async function sendGovtRevokeMail(receiver, link){
 
  //let account = await nodemailer.createTestAccount();

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cryptocredsone@gmail.com',
      pass: 'Blocktest@123'
    }
  });

  

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"CryptoCerts" <cryprocredsone@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: "Revoke Certificate", // Subject line
    text: "Hello world?", // plain text body
    html: '<p>Dear user,</p><br><p><a href="' + link + '">Click here</a> to add the certificate to your account. Please do not share this link or email with anyone. Delete this email after adding the certificate to your account.</p></br><p>CryptoCerts Team.<p>' // html body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
  
}

//User
async function sendUserRevokeMail(receiver, link){
  //let account = await nodemailer.createTestAccount();

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cryptocredsone@gmail.com',
      pass: 'Blocktest@123'
    }
  });

  let mailOptions = {
    from: '"CryptoCerts" <cryprocredsone@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: "REVOKE CERTIFICATE", // Subject line
    text: "Hello world?", // plain text body
    html: '<p>Dear User,</p><br><p><a href="' + link + '">Click here</a> to revoke the certificate to the account. Please do not share this link or email with anyone. Delete this email after adding the certificate to your account.</p></br><p>CryptoCerts Team.<p>' // html body
  };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
}


async function sendCertToReq(reciever, link){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cryptocredsone@gmail.com',
      pass: 'Blocktest@123'
    }
  });

  let mailOptions = {
    from: '"CryptoCerts" <cryprocredsone@gmail.com>', // sender address
    to: reciever, // list of receivers
    subject: "VIEW CERTIFICATE", // Subject line
    text: "Hello world?", // plain text body
    html: '<p>Dear User,</p><br><p><a href="' + link + '">Click here</a> to view the certificate to the account. Please do not share this link or email with anyone. Delete this email after adding the certificate to your account.</p></br><p>CryptoCerts Team.<p>' // html body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
}

module.exports = {sendCertMail: sendCertMail, sendGovtRevokeMail: sendGovtRevokeMail, sendUserRevokeMail: sendUserRevokeMail, sendCertToReq: sendCertToReq};