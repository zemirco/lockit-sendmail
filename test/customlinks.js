'use strict';


var customconfig = require('./customconfig.js');


var Email = require('../index.js');

// remove '=\r\n' from String - coming from quoted printable encoding ?!?
var clean = function(s) {
    return s.replace(/\r\n/g, '');
};

describe('custom link sendmail', function() {

    var email = new Email(customconfig);



    describe('custom link signup()', function() {



        it('should generate the correct link target', function(done) {
            email.signup('john', 'john@email.com', 'qweqwe', function(err, res) {
                if (err) {console.log(err); }
                var link = 'href="http://localhost:3000/#/custom-signup/qweqwe">Click here</a>';
                clean(res.response.toString()).should.containEql(clean(link));
                done();
            });
        });

    });


    describe('custom link resend()', function() {


        it('should generate the correct link target', function(done) {
            email.resend('john', 'john@email.com', 'qweqwe', function(err, res) {
                if (err) {console.log(err); }
                var link = 'href="http://localhost:3000/#/custom-signup/qweqwe">Click here</a>';
                res.response.toString().should.containEql(link);
                done();
            });
        });

    });


    describe('custom link forgot()', function() {

        it('should generate the correct link target', function(done) {
            email.forgot('john', 'john@email.com', 'qweqwe', function(err, res) {
                if (err) {console.log(err); }
                var link = 'href="http://localhost:3000/#/custom-forgot/qweqwe">Click here</a>';
                clean(res.response.toString()).should.containEql(link);
                done();
            });
        });

    });

});