
var nodemailer = require('nodemailer');
var ejs = require('ejs');

module.exports = function(config) {

  // load email template as specified in config
  var template = require(config.emailTemplate);

  // constructor function
  var Email = function(type) {
    
    // save type of email for proper link generation
    this._type = type;

    // set subject, title and text for email
    this._subject = config[type].subject;
    this._title = config[type].title;
    this._text = config[type].text;
    
  };
  
  // send email
  // token is optional
  Email.prototype.send = function(username, email, token, done) {
    
    // sometimes token isn't needed
    if (arguments.length === 3) {
      done = token;
    }
    
    var that = this;
    
    // load template
    template(this._title, this._text, function(err, html) {
      if (err) return done(err);
      
      // create link if necessary
      var link = '';
      if (that._type !== 'emailSignupTaken') {
        switch (that._type) {
          case 'emailSignup':
            link = '<a href="' + config.url + config.signupRoute + '/verify/' + token + '">' + config.emailSignup.linkText + '</a>';
            break;
          case 'emailResendVerification':
            link = '<a href="' + config.url + config.signupRoute + '/verify/' + token + '">' + config.emailResendVerification.linkText + '</a>';
            break;
          case 'emailForgotPassword':
            link = '<a href="' + config.url + config.forgotPasswordRoute + '/' + token + '">' + config.emailForgotPassword.linkText + '</a>';
            break;
        }
      }

      // default local variables
      that.locals = {
        appname: config.appname,
        link: link,
        username: username
      };
      
      // add options
      that.options = {
        from: config.emailFrom,
        to: email,
        subject: ejs.render(that._subject, that.locals),
        html: ejs.render(html, that.locals)
      };
      
      var smtpTransport = nodemailer.createTransport(config.emailType, config.emailSettings);
      smtpTransport.sendMail(that.options, function(err, res){
        if(err) return done(err);
        smtpTransport.close(); // shut down the connection pool, no more messages
        done(null, res);
      });
    });
    
  };
  
  // return constructor function
  return Email;
    
};