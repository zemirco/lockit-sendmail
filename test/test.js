
var should = require('should');
var fs = require('fs');
var mimelib = require('mimelib');
var config = require('./config.js');

var sendmail = require('../index.js')(config);

// remove '=\r\n' from String - coming from quoted printable encoding ?!?
String.prototype.clean = function() {
  return this.replace(/\=\r\n/g, '');
};

describe('sendmail', function() {

  var defaultPath = __dirname + '/../templates/' + config.emailTemplate + '/';

  describe('require module', function() {

    it ('should render email verification template', function(done) {
      fs.readFile(defaultPath + 'signup-email-verification.html', 'utf8', function(err, data) {
        if (err) console.log(err);
        data.should.include(config.emailSignup.text);
        data.should.include(config.emailSignup.title);
        done();
      });
    });

    it ('should render email taken template', function(done) {
      fs.readFile(defaultPath + 'signup-email-taken.html', 'utf8', function(err, data) {
        if (err) console.log(err);
        data.should.include(config.emailSignupTaken.text);
        data.should.include(config.emailSignupTaken.title);
        done();
      });
    });

    it ('should render resend verification template', function(done) {
      fs.readFile(defaultPath + 'signup-resend-verification.html', 'utf8', function(err, data) {
        if (err) console.log(err);
        data.should.include(config.emailResendVerification.text);
        data.should.include(config.emailResendVerification.title);
        done();
      });
    });

    it ('should render forgot password template', function(done) {
      fs.readFile(defaultPath + 'forgot-password.html', 'utf8', function(err, data) {
        if (err) console.log(err);
        data.should.include(config.emailForgotPassword.text);
        data.should.include(config.emailForgotPassword.title);
        done();
      });
    });

  });

  describe('emailVerification()', function() {

    it('should use the correct recipient email address', function(done) {
      sendmail.emailVerification('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('To: ' + 'john@email.com');
        done();
      });
    });

    it('should set the right subject', function(done) {
      sendmail.emailVerification('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('Subject: ' + 'Welcome to Test App');
        done();
      });
    });

    it('should use the correct local variables', function(done) {
      sendmail.emailVerification('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('<h2>Hello john</h2>');
        var link = mimelib.encodeQuotedPrintable('<a href="http://localhost:3000/signup/abc123">Click here</a>');
        res.message.clean().should.include(link.clean());
        done();
      });
    });

  });

  describe('emailTaken()', function() {

    it('should use the correct recipient email address', function(done) {
      sendmail.emailTaken('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('To: ' + 'john@email.com');
        done();
      });
    });

    it('should set the right subject', function(done) {
      sendmail.emailTaken('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('Subject: ' + 'Email already registered');
        done();
      });
    });

    it('should use the correct local variables', function(done) {
      sendmail.emailTaken('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.clean().should.include('<h2>Hello john</h2>you or someone else tried to sign up for Test App.');
        res.message.clean().should.include('Your email is already registered and you cannot sign up twice.');
        done();
      });
    });

  });

  describe('resendVerification()', function() {

    it('should use the correct recipient email address', function(done) {
      sendmail.resendVerification('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('To: ' + 'john@email.com');
        done();
      });
    });

    it('should set the right subject', function(done) {
      sendmail.resendVerification('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('Subject: ' + 'Complete your registration at Test App');
        done();
      });
    });

    it('should use the correct local variables', function(done) {
      sendmail.resendVerification('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('<h2>Hello john</h2>');
        var link = mimelib.encodeQuotedPrintable('<a href="http://localhost:3000/signup/abc123">Click here</a>');
        res.message.clean().should.include(link.clean() + ' to complete your registration for Test App');
        done();
      });
    });

  });

  describe('forgotPassword()', function() {

    it('should use the correct recipient email address', function(done) {
      sendmail.forgotPassword('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('To: ' + 'john@email.com');
        done();
      });
    });

    it('should set the right subject', function(done) {
      sendmail.forgotPassword('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('Subject: ' + 'Reset your password');
        done();
      });
    });

    it('should use the correct local variables', function(done) {
      sendmail.forgotPassword('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('<h2>Hey john</h2>');
        var link = mimelib.encodeQuotedPrintable('<a href="http://localhost:3000/forgot-password/abc123">Click here</a>');
        res.message.clean().should.include(link.clean() + ' to reset your password.');
        done();
      });
    });

  });

});