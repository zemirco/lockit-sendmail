
var should = require('should');
var mimelib = require('mimelib');
var config = require('./config.js');

var Email = require('../index.js')(config);

// remove '=\r\n' from String - coming from quoted printable encoding ?!?
String.prototype.clean = function() {
  return this.replace(/=\r\n/g, '');
};

describe('sendmail', function() {

  describe('common features', function() {

    it('should use the correct recipient email address', function(done) {
      var email = new Email('emailSignup');
      email.send('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('To: ' + 'john@email.com');
        done();
      });
    });

    it('should set the right subject', function(done) {
      var email = new Email('emailSignup');
      email.send('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('Subject: ' + 'Welcome to Test App');
        done();
      });
    });

    it('should use the correct local variables', function(done) {
      var email = new Email('emailSignup');
      email.send('john', 'john@email.com', 'abc123', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('<h2>Hello john</h2>');
        var link = mimelib.encodeQuotedPrintable('<a href="http://localhost:3000/signup/abc123">Click here</a>');
        res.message.clean().should.include(link.clean());
        done();
      });
    });

    it('should use contain username in the mail', function(done) {
      var email = new Email('emailSignup');
      email.send('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('john');
        done();
      });
    });

    it('should use proper configuration values by default', function(done) {
      var email = new Email('emailSignup');
      email.send('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include(config.appname);
        done();
      });
    });

  });
  
  describe('send email on signup', function() {
    
    it('should use the correct text from config', function(done) {
      var email = new Email('emailSignup');
      email.send('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('Welcome to Test App!');
        done();
      });
    });
    
    it('should generate the correct link target', function(done) {
      var email = new Email('emailSignup');
      email.send('john', 'john@email.com', 'qweqwe', function(err, res) {
        if (err) console.log(err);
        var link = mimelib.encodeQuotedPrintable('<a href="http://localhost:3000/signup/qweqwe">Click here</a>');
        res.message.clean().should.include(link.clean());
        done();
      });
    });
    
  });

  describe('send email to owner when duplicate email tries to sign up', function() {

    it('should use the correct text from config', function(done) {
      var email = new Email('emailSignupTaken');
      email.send('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('Your email is already registered and you cannot sign up twice');
        done();
      });
    });

  });

  describe('resend email with link for verification', function() {

    it('should use the correct text from config', function(done) {
      var email = new Email('emailResendVerification');
      email.send('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('here is the link again.');
        done();
      });
    });

    it('should generate the correct link target', function(done) {
      var email = new Email('emailResendVerification');
      email.send('john', 'john@email.com', 'qweqwe', function(err, res) {
        if (err) console.log(err);
        var link = mimelib.encodeQuotedPrintable('<a href="http://localhost:3000/signup/qweqwe">Click here</a>');
        res.message.clean().should.include(link.clean());
        done();
      });
    });

  });

  describe('send forgot password link', function() {

    it('should use the correct text from config', function(done) {
      var email = new Email('emailForgotPassword');
      email.send('john', 'john@email.com', function(err, res) {
        if (err) console.log(err);
        res.message.should.include('to reset your password.');
        done();
      });
    });

    it('should generate the correct link target', function(done) {
      var email = new Email('emailForgotPassword');
      email.send('john', 'john@email.com', 'qweqwe', function(err, res) {
        if (err) console.log(err);
        var link = mimelib.encodeQuotedPrintable('<a href="http://localhost:3000/forgot-password/qweqwe">Click here</a>');
        res.message.clean().should.include(link.clean());
        done();
      });
    });

  });

});