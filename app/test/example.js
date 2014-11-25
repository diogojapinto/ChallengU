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
        request(url)
            .post('/login')
            .send(user)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.statusCode.should.equal(400);
                done();
            });
    });

    it('should login correctly', function (done) {
        var user = {
            username: 'modd1',
            password: 'passmod1'
        };
        request(url)
            .post('/login')
            .send(user)
            .end(function (err, res, req) {
                if (err) {
                    throw err;
                }
                res.statusCode.should.equal(200);
                done();
            });
    });
});

 describe('Challenge', function () {
    it('should return error because the the category field is empty', function (done) {
        var user = {
            username: 'modd1',
            password: 'passmod1'
        };
        request(url)
            .post('/login')
            .send(user)
            .end(function (err, res, req) {
                if (err) {
                    throw err;
                }
                res.statusCode.should.equal(200);

                var challenge = {
                    name       : 'blablabla',
                    category   : [],
                    type       : "video",
                    difficulty : "3",
                    description: "bla bla bla whiskas saquetas"
                };
                request(url)
                    .post('/create-challenge')
                    .send(challenge)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.statusCode.should.equal(400);
                        done();
                    });
            });


    });

    it('should return success', function (done) {
        var user = {
            username: 'modd1',
            password: 'passmod1'
        };
        request(url)
            .post('/login')
            .send(user)
            .end(function (err, res, req) {
                if (err) {
                    throw err;
                }
                res.statusCode.should.equal(200);

                var challenge = {
                    name       : 'blablabla',
                    category   : [2,3],
                    type       : "video",
                    difficulty : "3",
                    description: "bla bla bla whiskas saquetas"
                };
                request(url)
                    .post('/create-challenge')
                    .send(challenge)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.statusCode.should.equal(400); //TODO
                        done();
                    });
            });

    });
 });

describe('Search', function () {
    it('should return nothing', function (done) {
        var user = {
            username: 'modd1',
            password: 'passmod1'
        };
        request(url)
            .post('/login')
            .send(user)
            .end(function (err, res, req) {
                if (err) {
                    throw err;
                }
                res.statusCode.should.equal(200);

                var value = 'random';
                request(url)
                    .get('/search/'+value)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.statusCode.should.equal(500); //TODO
                        done();
                    });
            });


    });

    it('should return results', function (done) {
        var user = {
            username: 'modd1',
            password: 'passmod1'
        };
        request(url)
            .post('/login')
            .send(user)
            .end(function (err, res, req) {
                if (err) {
                    throw err;
                }
                res.statusCode.should.equal(200);

                var value = 'most';
                request(url)
                    .get('/search/'+value)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.statusCode.should.equal(500); //TODO
                        done();
                    });
            });

    });
});