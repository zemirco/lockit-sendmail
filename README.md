# Lockit sendmail

[![Build Status](https://travis-ci.org/zemirco/lockit-sendmail.svg?branch=v0.1.2)](https://travis-ci.org/zemirco/lockit-sendmail) [![NPM version](https://badge.fury.io/js/lockit-sendmail.svg)](http://badge.fury.io/js/lockit-sendmail)

Email utilities for [Lockit](https://github.com/zemirco/lockit).

## Installation

`npm install lockit-sendmail`

```js
var Email = require('lockit-sendmail');
var config = require('./config.js');

var email = new Email(config);

email.signup('john', 'john@wayne.com', 'secret-token', function(err, res) {
  // res is the same res you would get from nodemailer
  // for more infos see https://github.com/andris9/Nodemailer#return-callback
})
```

## Configuration

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

## Methods

 - [verify email address on signup](#verify-email-address)
 - [notify on signup with duplicate email address](#duplicate-email-tries-to-sign-up)
 - [resend signup email for address verification](#send-email-address-verification-link-again)
 - [forgot password](#forgot-password-email)

### Verify email address

A new user has signed up and his email address needs to be verified.
An email with a link containing a unique token is sent to his email address.
When the user clicks on this link we know that the given email address exists und belongs to the right user.

```js
email.signup('john', 'john@wayne.com', 'abc-123-def', function(err, res) {
  if (err) console.log(err);
  // ...
})
```

You can configure the email's content through your `config.js`.
Just modify the `emailSignup` object.
Here is a sample setup.

```js
exports.emailSignup = {
  subject: 'Welcome to <%- appname %>',
  text: [
    '<h2>Hello <%- username %></h2>',
    'Welcome to <%- appname %>!',
    '<p><%- link %> to complete your registration.</p>'
  ].join(''),
  linkText: 'Click here'
};
```

 - `subject` - the email's subject
 - `text` - the email's body
 - `linkText` - the text of the link, which points back to our app

### Duplicate email tries to sign up

A user tries to sign up with an email address that already exists.
We send a hint to the right owner to indicate this happening.
Never expose to a user whether an email address exists or not.

```js
email.taken('john', 'john@wayne.com', function(err, res) {
  if (err) console.log(err);
  // ...
})
```

You can configure the email's content through your `config.js`.
Just modify the `emailSignupTaken` object.
Here is a sample setup.

```js
exports.emailSignupTaken = {
  subject: 'Email already registered',
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
 - `text` - the email's body

### Send email address verification link again

A user signed up but lost or didn't receive the email containing the link for his email address verification.
Therefore he should be able to send the link again, with a different verification token.

```js
email.resend('john', 'john@wayne.com', 'abc-123-def', function(err, res) {
  if (err) console.log(err);
  // ...
})
```

You can configure the email's content through your `config.js`.
Just modify the `emailResendVerification` object.
Here is a sample setup.

```js
exports.emailResendVerification = {
  subject: 'Complete your registration',
  text: [
    '<h2>Hello <%- username %></h2>',
    'here is the link again. <%- link %> to complete your registration.',
    '<p>The <%- appname %> Team</p>'
  ].join(''),
  linkText: 'Click here'
};
```

 - `subject` - the email's subject
 - `text` - the email's body
 - `linkText` - the text of the link, which points back to our app

### Forgot password email

A user has forgotten his password and would like to create a new one.
He enters his email address and an email with a link
containing a secret token is sent to his email address.

```js
email.forgot('john', 'john@wayne.com', 'abc-123-def', function(err, res) {
  if (err) console.log(err);
  // ...
})
```

You can configure the email's content through your `config.js`.
Just modify the `emailForgotPassword` object.
Here is a sample setup.

```js
exports.emailForgotPassword = {
  subject: 'Reset your password',
  text: [
    '<h2>Hey <%- username %></h2>',
    '<%- link %> to reset your password.',
    '<p>The <%- appname %> Team</p>'
  ].join(''),
  linkText: 'Click here'
};
```

 - `subject` - the email's subject
 - `text` - the email's body
 - `linkText` - the text of the link, which points back to our app

## Test

`grunt`

## License

MIT
