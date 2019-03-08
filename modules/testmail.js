var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cryptocredsone@gmail.com',
    pass: 'Blocktest@123'
  }
});

var mailOptions = {
  from: 'cryptocredsone@gmail.com',
  to: 'ketkar203040@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  html: '<h1>Test</h1><a href="http://www.google.com">Google</a>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 