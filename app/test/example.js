// load Unit.js module
//var test = require('unit.js');
var should = require('should');
var assert = require('assert');
var request = require('supertest');

/*
 // just for example of tested value
 var example = 'hello';
 // assert that example variable is a string
 test.string(example);
 // or with Must.js
 test.must(example).be.a.string();
 // or with assert
 test.assert(typeof example === 'string');*/

var url = 'http://178.62.101.158:8081';

describe('Account', function () {

    it('should return error because the user does not exist', function (done) {
        var user = {
            username: 'blablabla',
            password: 'testblabla'
        };
        // once we have specified the info we want to send to the server via POST verb,
        // we need to actually perform the action on the resource, in this case we want to
        // POST on /login-user and we want to send some info
        // We do this using the request object, requiring supertest!
        request(url)
            .post('/login-user')
            .send(user)
            // end handles the response
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                // this is should.js syntax, very clear
                res.statusCode.should.equal(400);
                done();
            });
    });

    it('should login correctly', function (done) {
        var user = {
            username: 'modd1',
            password: 'passmod1'
        };
        // once we have specified the info we want to send to the server via POST verb,
        // we need to actually perform the action on the resource, in this case we want to
        // POST on /login-user and we want to send some info
        // We do this using the request object, requiring supertest!
        request(url)
            .post('/login-user')
            .send(user)
            // end handles the response
            .end(function (err, res, req) {
                if (err) {
                    throw err;
                }
                // this is should.js syntax, very clear
                res.statusCode.should.equal(200);
                //req.session.should.equal(user);
                done();
            });
    });
});

describe('Challenge', function() {
 it('should return error because the the category field is empty', function (done) {
 var challenge = {
 name: 'blablabla',
 category: [],
 type: "video",
 difficulty: "3",
 description: "bla bla bla whiskas saquetas"
 };
 // once we have specified the info we want to send to the server via POST verb,
 // we need to actually perform the action on the resource, in this case we want to
 // POST on /create-challenge and we want to send some info
 // We do this using the request object, requiring supertest!
 request(url)
 .post('/create-challenge')
 .send(challenge)
 // end handles the response
 .end(function (err, res) {
 if (err) {
 throw err;
 }
 // this is should.js syntax, very clear
 res.statusCode.should.equal(400);
 done();
 });
 });

 it('should return success', function (done) {
 var challenge = {
 name: 'blablabla',
 category: [1],
 type: "video",
 difficulty: "3",
 description: "bla bla bla whiskas saquetas"
 };
 // once we have specified the info we want to send to the server via POST verb,
 // we need to actually perform the action on the resource, in this case we want to
 // POST on /create-challenge and we want to send some info
 // We do this using the request object, requiring supertest!
 request(url)
 .post('/create-challenge')
 .send(challenge)
 // end handles the response
 .end(function (err, res) {
 if (err) {
 throw err;
 }
 // this is should.js syntax, very clear
 res.statusCode.should.equal(200);
 done();
 });
 });
});