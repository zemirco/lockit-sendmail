'use strict';

var restconfig = require('./restconfig.js');

// for send() tests
restconfig.test = {
    subject: 'Hello there',
    title: 'Hello there',
    text: '<h2>Welcome to lockit!</h2><p><%- link %></p>'
};

var Email = require('../index.js');

// remove '=\r\n' from String - coming from quoted printable encoding ?!?
var clean = function(s) {
    return s.replace(/\r\n/g, '');
};

describe('rest sendmail', function() {

    var email = new Email(restconfig);

    describe('rest send()', function() {

        var that = {
            transport: require('nodemailer-stub-transport'),
            template: require(restconfig.emailTemplate),
            config: restconfig,
            link: '<a href="http://localhost:3000/rest/signup/abc123">Click here</a>'
        };
        var send = email.send.bind(that);


        it('should use the correct local variables', function(done) {
            send('test', 'john', 'john@email.com', function(err, res) {
                if (err) {console.log(err); }
                res.response.toString().should.containEql('Welcome to lockit!');
                var link = 'href="http://localhost:3000/rest/signup/abc123">Click here</a>';
                clean(res.response.toString()).should.containEql(clean(link));
                done();
            });
        });

    });

    describe('rest signup()', function() {



        it('should generate the correct link target', function(done) {
            email.signup('john', 'john@email.com', 'qweqwe', function(err, res) {
                if (err) {console.log(err); }
                var link = 'href="http://localhost:3000/rest/signup/qweqwe">Click here</a>';
                clean(res.response.toString()).should.containEql(clean(link));
                done();
            });
        });

    });


    describe('rest resend()', function() {


        it('should generate the correct link target', function(done) {
            email.resend('john', 'john@email.com', 'qweqwe', function(err, res) {
                if (err) {console.log(err); }
                var link = 'href="http://localhost:3000/rest/signup/qweqwe">Click here</a>';
                res.response.toString().should.containEql(link);
                done();
            });
        });

    });

    describe('rest forgot()', function() {


        it('should generate the correct link target', function(done) {
            email.forgot('john', 'john@email.com', 'qweqwe', function(err, res) {
                if (err) {console.log(err); }
                var link = 'href="http://localhost:3000/rest/forgot-password/qweqwe">Click here</a>';
                clean(res.response.toString()).should.containEql(link);
                done();
            });
        });

    });

});