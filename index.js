
var nodemailer = require('nodemailer');
var ejs = require('ejs');

module.exports = function(config) {

  // load email template as specified in config
  var template = require(config.emailTemplate);



  // constructor function
  var Email = function(type) {

    // make "new" optional
    if (!(this instanceof Email)) {
      return new Email(type);
    }

    // save type of email for proper link generation
    this.type = type;

  };



  // send email, token is optional
  Email.prototype.send = function(username, email, token, done) {

    // sometimes token isn't needed
    if (arguments.length === 3) {
      done = token;
    }

    // link lookup map
    var linkMap = {
      emailSignup: '<a href="' + config.url + config.signup.route + '/' + token + '">' + config.emailSignup.linkText + '</a>',
      emailResendVerification: '<a href="' + config.url + config.signup.route + '/' + token + '">' + config.emailResendVerification.linkText + '</a>',
      emailForgotPassword: '<a href="' + config.url + config.forgotPassword.route + '/' + token + '">' + config.emailForgotPassword.linkText + '</a>'
    };

    // get subject, title and text from config file
    var subject = config[this.type].subject;
    var title = config[this.type].subject;
    var text = config[this.type].text;

    // create link for email
    var link = linkMap[this.type] || '';

    // create html from template module
    template(title, text, function(err, html) {
      if (err) return done(err);

      // default local variables
      var locals = {
        appname: config.appname,
        link: link,
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



  // return constructor function
  return Email;

};
