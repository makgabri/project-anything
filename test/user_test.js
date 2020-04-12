'use strict';

/** Required Node Libraries **/
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const test = require('tape');
const agent = request.agent(app);
const user_model = mongoose.model("users");
const local_model = mongoose.model("local_users");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const user = {
    familyName: 'foo',
    givenName: 'bar',
    username: 'foobar',
    password: 'foobar'
}

test('App User - User signing up', function(t) {
    t.pass("Signing up should return code 200");
    agent
        .post('/signup/')
        .send(user)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(t.end);
});

test('App User - Existing username sign up', function(t) {
    t.pass("Signing up with an existing username should return code 409");
    agent
        .post('/signup/')
        .send(user)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(409)
        .end(t.end);
});

test('App User - Sign in with foo', function(t) {
    t.pass("Sign in should return code 200");
    agent
        .post('/signin/')
        .send({username: 'foobar', password: 'foobar'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(t.end);
})

test('App User - Get full name of foobar', function(t) {
    t.pass("get firstName should return foo and givenName should return bar");
    agent
        .get('/user_name/')
        .expect('Content-Type', /json/)
        .expect(200, {
            givenName: 'bar',
            familyName: 'foo'
        })
        .end(t.end);
})


test('Mongoose - removing foobar from users', function(t) {
    user_model.deleteMany({key: 'foobar'}, function(err, n) {
        if (err) return t.ifError(err);
        t.same(n.deletedCount, 1, 'Delete count should be 1');
        t.end();
    });
});

test('Mongoose - removing foobar from local', function(t) {
    local_model.deleteMany({username: 'foobar'}, function(err, n) {
        if (err) return t.ifError(err);
        t.same(n.deletedCount, 1, 'Delete count should be 1');
        t.end();
    });
});

test.onFinish(function() {process.exit(0)});