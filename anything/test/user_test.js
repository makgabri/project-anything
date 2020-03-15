'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = mongoose.model('users');
const Local = mongoose.model('local_users');
const agent = request.agent(app);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const user = {
    familyName: 'foo',
    givenName: 'bar',
    username: 'foobar',
    password: 'foobar'
}

describe('User sign up testing', function() {
    it('should create a new local user', function(done) {
        request(app)
        .post('/signup/')
        .send(user)
        .expect(200, done);
    });

    it('should create a same user', function(done) {
        request(app)
        .post('/signup/')
        .send(user)
        .expect(409, done);
    });
});

describe('User sign in testing', function() {
    it('should login user', function(done) {
        request(app)
        .post('/signup/')
        .send({
            familyName: 'foo',
            givenName: 'bar',
            username: 'foobar',
            password: 'foobar'
        })
        .expect(200, done);
    });

    it('should create a same user', function(done) {
        request(app)
        .post('/signup/')
        .send({
            familyName: 'foo',
            givenName: 'bar',
            username: 'foobar',
            password: 'foobar'
        })
        .expect(409, done);
    });
});

// CLean up created user
User.deleteOne({key: 'foobar'}, function(err) {
    if (err) return console.log(err);
    Local.deleteOne({username: 'foorbar'}, function(err) {
        if (err) return console.log(err);
        return console.log('Remove test user success');
    })
})