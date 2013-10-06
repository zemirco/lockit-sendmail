# Email utilities for lockit

[![Build Status](https://travis-ci.org/zeMirco/lockit-sendmail.png)](https://travis-ci.org/zeMirco/lockit-sendmail)

Email utilities for lockit middleware.

## Installation

`npm install lockit-sendmail`

Add credentials to your `config.js`. This module uses `nodemailer` for sending emails. You can therefore
use the same email types and email settings.

```js
exports.emailType = 'SMTP';
exports.emailSettings = {
  service: 'Gmail',
  auth: {
    user: 'john.wayne@gmail.com',
    pass: 'cowboy'
  }
};
```

```js
var sendmail = require('lockit-sendmail');
```

## What's included?

 - responsive email template (created by [mailchimp](https://github.com/mailchimp/Email-Blueprints))
 - inline css styles for proper formatting even in GMail and Outlook (CSS inlined with [juice](https://github.com/LearnBoost/juice))
 - html email templates for verify email address, email taken, forgot password and resend verification
 - works with the same configuration as [nodemailer](https://github.com/andris9/Nodemailer)
 - uses [node-uuid](https://github.com/broofa/node-uuid) for secret tokens

## Methods

 - [verify email address on signup](#verify-email-address)
 - [notify on signup with duplicate email address](#duplicate-email-tries-to-sign-up)
 - [resend signup email for address verification](#send-email-address-verification-link-again)
 - [forgot password](#forgot-password-email)

### Verify email address

A new user has signed up and his email address needs to be verified.
An email with a link containing a unique token is sent to his email address.
When the user clicks on this link we know that the given email address exists und belongs to the right user.
The `signup-email-verification.html` template is used with the `emailSignup` object from `config.js`.

![email verification on signup](https://s3.amazonaws.com/zeMirco/github/lockit-sendmail/signup-email-verification.png)

`sendmail.emailVerification(username, email, token, callback)`

 - `username`: String - i.e. 'john' - used in the email body
 - `mail`: String - i.e. 'john@email.com' - recipient email address
 - `token`: String - i.e. 'abc123' - secret token for email address verification
 - `callback`: Function - callback(err, message) - callback function when email was sent

```js
var sendmail = require('sendmail');

sendmail.emailVerification('john', 'john@email', 'abc123', function(err, message) {
  if (err) console.log(err);
  // ...
});
```

You can configure the email's content through your `config.js`. Just modify the `emailSignup` object.
Here is a sample setup.

```js
exports.emailSignup = {
  subject: 'Welcome to <%- appname %>',
  title: 'Welcome to <%- appname %>',
  text: [
    '<h2>Hello <%- username %></h2>',
    'Welcome to <%- appname %>!',
    '<p><%- link %> to complete your registration.</p>'
  ].join(''),
  linkText: 'Click here'
};
```

 - `subject` - the email's subject
 - `title` - the title of the html email. Doesn't have to be the same as `subject`
 - `text` - the email's body
 - `linkText` - the text of the link, which points back to our app

### Duplicate email tries to sign up

A user tries to sign up with an email address that already exists.
We send a hint to the right owner to indicate this happening.
Never expose to a user whether an email address exists or not.
The `signup-email-taken.html` template is used with the `emailSignupTaken` object from `config.js`.

![email already taken](https://s3.amazonaws.com/zeMirco/github/lockit-sendmail/signup-email-taken.png)

`sendmail.emailTaken(username, email, callback)`

 - `username`: String - i.e. 'john' - used in the email body
 - `email`: String - i.e. `john@email.com` - recipient email address
 - `callback`: String - callback(err, message) - callback function when email was sent

```js
var sendmail = require('sendmail');

sendmail.emailTaken('john', 'john@email', function(err, message) {
  if (err) console.log(err);
  // ...
});
```

You can configure the email's content through your `config.js`. Just modify the `emailSignupTaken` object.
Here is a sample setup.

```js
exports.emailSignupTaken = {
  subject: 'Email already registered',
  title: 'Email already registered',
  text: [
    '<h2>Hello <%- username %></h2>',
    'you or someone else tried to sign up for <%- appname %>.',
    '<p>Your email is already registered and you cannot sign up twice.',
    ' If you haven\'t tried to sign up, you can safely ignore this email. Everything is fine!</p>',
    '<p>The <%- appname %> Team</p>'
  ].join('')
};
```

 - `subject` - the email's subject
 - `title` - the title of the html email. Doesn't have to be the same as `subject`
 - `text` - the email's body

### Send email address verification link again

A user signed up but lost or didn't receive the email containing the link for his email address verification.
Therefore he should be able to send the link again, with a different verification token.
The `signup-resend-verification.html` template is used with the `emailResendVerification` object from `config.js`.

![resend verification email](https://s3.amazonaws.com/zeMirco/github/lockit-sendmail/signup-resend-verification.png)

`sendmail.resendVerification(username, email, token, callback)`

 - `username`: String - i.e. 'john' - used in the email body
 - `email`: String - i.e. 'john@email.com' - recipient email address
 - `token`: String - i.e. 'cde456' - secret token for email verification
 - `callback`: Function - callback(err, message) - callback function when email was sent

```js
var sendmail = require('sendmail');

sendmail.resendVerification('john', 'john@email', 'cde456', function(err, message) {
  if (err) console.log(err);
  // ...
});
```

You can configure the email's content through your `config.js`. Just modify the `emailResendVerification` object.
Here is a sample setup.

```js
exports.emailResendVerification = {
  subject: 'Complete your registration',
  title: 'Complete your registration',
  text: [
    '<h2>Hello <%- username %></h2>',
    'here is the link again. <%- link %> to complete your registration.',
    '<p>The <%- appname %> Team</p>'
  ].join(''),
  linkText: 'Click here'
};
```

 - `subject` - the email's subject
 - `title` - the title of the html email. Doesn't have to be the same as `subject`
 - `text` - the email's body
 - `linkText` - the text of the link, which points back to our app

### Forgot password email

A user has forgotten his password and would like to create a new one.
He enters his email address and an email with a link
containing a secret token is sent to his email address.
The `forgot-password.html` template is used with the `emailForgotPassword` object from `config.js`.

![forgot password](https://s3.amazonaws.com/zeMirco/github/lockit-sendmail/forgot-password.png)

`sendmail.forgotPassword(username, email, token, callback)`

 - `username`: String - i.e. 'john' - used in the email body
 - `email`: String - i.e. 'john@email.com' - recipient email address
 - `token`: String - i.e. 'abc123' - secret token for email verification
 - `callback`: Function - callback(err, message) - callback function when email was sent

```js
var sendmail = require('sendmail');

sendmail.forgotPassword('john', 'john@email', 'abc123', function(err, message) {
  if (err) console.log(err);
  // ...
});
```

You can configure the email's content through your `config.js`. Just modify the `emailForgotPassword` object.
Here is a sample setup.

```js
exports.emailForgotPassword = {
  subject: 'Reset your password',
  title: 'Reset your password',
  text: [
    '<h2>Hey <%- username %></h2>',
    '<%- link %> to reset your password.',
    '<p>The <%- appname %> Team</p>'
  ].join(''),
  linkText: 'Click here'
};
```

 - `subject` - the email's subject
 - `title` - the title of the html email. Doesn't have to be the same as `subject`
 - `text` - the email's body
 - `linkText` - the text of the link, which points back to our app

## Test

`grunt`

## License

Copyright (C) 2013 [Mirco Zeiss](mailto: mirco.zeiss@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.