# Lockit sendmail

[![Build Status](https://travis-ci.org/zeMirco/lockit-sendmail.png)](https://travis-ci.org/zeMirco/lockit-sendmail) [![NPM version](https://badge.fury.io/js/lockit-sendmail.png)](http://badge.fury.io/js/lockit-sendmail)

Email utilities for [Lockit](https://github.com/zeMirco/lockit).

## Installation

`npm install lockit-sendmail`

```js
var Email = require('lockit-sendmail');

// var email = new Email(type)
// where type can be
// - 'emailSignup'
// - 'emailSignupTaken'
// - 'emailResendVerification'
// - 'emailForgotPassword'

var email = new Email('emailSignup')
email.send('john', 'john@wayne.com', 'secret-token', function(err, res) {
  // res is the same res you would get from nodemailer
  // for more infos see https://github.com/andris9/Nodemailer#return-callback
})
```

The third argument `secret-token` is optional. It is usually required but not for the email that
tells a user that an email address is already registered.

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
var email = new Email('emailSignup');
email.send('john', 'john@wayne.com', 'abc-123-def', function(err, res) {
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
var email = new Email('emailSignupTaken');
email.send('john', 'john@wayne.com', function(err, res) {
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
var email = new Email('emailResendVerification');
email.send('john', 'john@wayne.com', 'abc-123-def', function(err, res) {
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
var email = new Email('emailForgotPassword');
email.send('john', 'john@wayne.com', 'abc-123-def', function(err, res) {
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

Copyright (C) 2013 [Mirco Zeiss](mailto: mirco.zeiss@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.