
var nodemailer = require('nodemailer');
var ejs = require('ejs');

module.exports = function(config) {

  // load email template as specified in config
  var template = require(config.emailTemplate);

  // constructor function
  var Email = function(type) {
    
    // save type of email for proper link generation
    this.type = type;
    
  };
  
  // send email
  // token is optional
  Email.prototype.send = function(username, email, token, done) {
    
    // sometimes token isn't needed
    if (arguments.length === 3) {
      done = token;
    }
        
    var that = this;
    
    // get subject, title and text from config file
    var subject = config[that.type].subject;
    var title = config[that.type].title;
    var text = config[that.type].text;
    
    // load template
    template(title, text, function(err, html) {
      if (err) return done(err);
      
      // create link if necessary
      var link = '';
      if (that.type !== 'emailSignupTaken' && typeof token === 'string') {
        switch (that.type) {
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