
var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');
var ejs = require('ejs');

// tmp var to prevent rendering of templates twice
var hasBeenRequired = false;

// read template from file and insert local variables
function _render(template, locals, cb) {
  ejs.renderFile(path.join(__dirname, 'templates/base-boxed-basic-query/' + template), locals, cb);
}

// send email with nodemailer
function _send(config, options, cb) {
  var smtpTransport = nodemailer.createTransport(config.emailType, config.emailSettings);

  smtpTransport.sendMail(options, function(err, res){
    if(err) return cb(err);
    smtpTransport.close(); // shut down the connection pool, no more messages
    cb(null, res);
  });
}

module.exports = function(config) {

  // render templates for various emails
  function _renderTemplates() {

    var templates = [
      {name: 'signup-email-verification.html', desc: 'emailSignup'},
      {name: 'signup-email-taken.html', desc: 'emailSignupTaken'},
      {name: 'signup-resend-verification.html', desc: 'emailResendVerification'},
      {name: 'forgot-password.html', desc: 'emailForgotPassword'}
    ];

    var locals = {};

    // write templates from array to disk
    templates.forEach(function(item) {

      // get local variables
      locals = {
        content: config[item.desc].text,
        title: config[item.desc].title
      };

      // read original template from file
      ejs.renderFile(path.join(__dirname, 'templates/base-boxed-basic-query/original-inline-styles.html'), locals, function(err, html) {
        if (err) console.log(err);

        // write template with given locals
        fs.writeFile(path.join(__dirname, 'templates/base-boxed-basic-query/' + item.name), html, function(err) {
          if (err) console.log(err);
          if (config.debug) console.log('lockit-sendmail: '.green + item.name + ' template rendered');
        });

      });
    });

  }

  // render email templates
  // but render only once even if the modules is required multiple times from different middlewares
  if (!hasBeenRequired) {
    _renderTemplates();
    hasBeenRequired = true;
  }


  var mail = {};

  // email verification link - after POST /signup
  mail.emailVerification = function(username, email, token, done) {

    var locals = {
      appname: config.appname,
      username: username,
      link: '<a href="' + config.url + config.signupRoute + '/' + token + '">' + config.emailSignup.linkText + '</a>',
    };

    // read template from file and insert local variables
    _render('signup-email-verification.html', locals, function(err, html) {
      if (err) console.log(err);

      // set email options
      var options = {
        from: config.emailFrom,
        to: email,
        subject: ejs.render(config.emailSignup.subject, locals),
        html: html
      };

      // send email with nodemailer
      _send(config, options, done);

    });

  };

  // duplicate email during sign up process - after POST /signup
  mail.emailTaken = function(username, email, done) {

    var locals = {
      appname: config.appname,
      username: username
    };

    // read template from file and insert local variables
    _render('signup-email-taken.html', locals, function(err, html) {
      if (err) console.log(err);

      // set email options
      var options = {
        from: config.emailFrom,
        to: email,
        subject: ejs.render(config.emailSignupTaken.subject, locals),
        html: html
      };

      // send email with nodemailer
      _send(config, options, done);

    });

  };

  // resend email verification
  mail.resendVerification = function(username, email, token, done) {

    var locals = {
      appname: config.appname,
      username: username,
      link: '<a href="' + config.url + config.signupRoute + '/' + token + '">' + config.emailResendVerification.linkText + '</a>'
    };

    // read template from file and insert local variables
    _render('signup-resend-verification.html', locals, function(err, html) {
      if (err) console.log(err);

      // set email options
      var options = {
        from: config.emailFrom,
        to: email,
        subject: ejs.render(config.emailResendVerification.subject, locals),
        html: html
      };

      // send email with nodemailer
      _send(config, options, done);

    });

  };

  // mail sent when user forgot password
  mail.forgotPassword = function(username, email, token, done) {

    var locals = {
      appname: config.appname,
      username: username,
      link: '<a href="' + config.url + config.forgotPasswordRoute + '/' + token + '">' + config.emailForgotPassword.linkText + '</a>'
    };

    // read template from file and insert local variables
    _render('forgot-password.html', locals, function(err, html) {
      if (err) console.log(err);

      // set email options
      var options = {
        from: config.emailFrom,
        to: email,
        subject: ejs.render(config.emailForgotPassword.subject, locals),
        html: html
      };

      // send email with nodemailer
      _send(config, options, done);

    });
    
  };

  // export email object
  return mail;
};