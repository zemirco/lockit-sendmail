
var nodemailer = require('nodemailer');
var ejs = require('ejs');



/**
 * Email constructor function.
 *
 * @constructor
 * @param {Object} config
 */
var Email = module.exports = function(config) {
  if (!(this instanceof Email)) return new Email(config);
  this.template = require(config.emailTemplate);
  this.config = config;
};



/**
 * Send email with nodemailer.
 *
 * @private
 * @param {String} type
 * @param {String} username
 * @param {String} email
 * @param {Function} done
 */
Email.prototype.send = function(type, username, email, done) {
  var config = this.config;
  var that = this;

  var subject = config[type].subject;
  var title = config[type].title;
  var text = config[type].text;

  this.template(title, text, function(err, html) {
    if (err) return done(err);

    // default local variables
    var locals = {
      appname: config.appname,
      link: that.link,
      username: username
    };

    // add options
    var options = {
      from: config.emailFrom,
      to: email,
      subject: ejs.render(subject, locals),
      html: ejs.render(html, locals)
    };

    // send email with nodemailer
    var smtpTransport = nodemailer.createTransport(config.emailType, config.emailSettings);
    smtpTransport.sendMail(options, function(err, res){
      if(err) return done(err);
      smtpTransport.close(); // shut down the connection pool, no more messages
      done(null, res);
    });
  });

};



/**
 * Send signup email.
 *
 * @param {String} username
 * @param {String} email
 * @param {String} token
 * @param {Function} done
 */
Email.prototype.signup = function(username, email, token, done) {
  var c = this.config;
  this.link = '<a href="' + c.url + c.signup.route + '/' + token + '">' + c.emailSignup.linkText + '</a>';
  this.send('emailSignup', username, email, done);
};



/**
 * Send signup email again.
 *
 * @param {String} username
 * @param {String} email
 * @param {String} token
 * @param {Function} done
 */
Email.prototype.resend = function(username, email, token, done) {
  var c = this.config;
  this.link = '<a href="' + c.url + c.signup.route + '/' + token + '">' + c.emailResendVerification.linkText + '</a>';
  this.send('emailResendVerification', username, email, done);
};



/**
 * Send email to email address owner with notice about signup.
 *
 * @param {String} username
 * @param {String} email
 * @param {Function} done
 */
Email.prototype.taken = function(username, email, done) {
  this.send('emailSignupTaken', username, email, done);
};



/**
 * Send email with link for new password.
 *
 * @param {String} username
 * @param {String} email
 * @param {String} token
 * @param {Function} done
 */
Email.prototype.forgot = function(username, email, token, done) {
  var c = this.config;
  this.link = '<a href="' + c.url + c.forgotPassword.route + '/' + token + '">' + c.emailForgotPassword.linkText + '</a>';
  this.send('emailForgotPassword', username, email, done);
};
