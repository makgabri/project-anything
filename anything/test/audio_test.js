'use strict';

/** Required Node Libraries **/
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const test = require('tape');
const agent = request.agent(app);
const project_model = mongoose.model("project");
const track_model = mongoose.model("track");
const user_model = mongoose.model("users");
const local_model = mongoose.model("local_users");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const user = {
    familyName: 'foo',
    givenName: 'bar',
    username: 'foobar',
    password: 'foobar'
}

test('App User - Setting up foobar', function(t) {
    t.pass("Signing up should return code 200");
    agent
        .post('/signup/')
        .send(user)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(t.end);
});

test('App User - Preparring agent with login', function(t) {
    t.pass("Sign in should return code 200");
    agent
        .post('/signin/')
        .send({username: 'foobar', password: 'foobar'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(t.end);
})

test('App Project - Creating project', function(t) {
    t.pass("Creating project with title test success");
    agent
        .post('/add_project/')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({title: "test"})
        .expect(200)
        .end(function(err, res) {
            t.same(res.body.author, 'foobar', 'author should be foobar');
            t.same(res.body.title, 'test', 'title should be test');
            t.end();
        });
})

test('App Project - Creating project2', function(t) {
    t.pass("Creating project with title test success");
    agent
        .post('/add_project/')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({title: "test2"})
        .expect(200)
        .end(function(err, res) {
            t.same(res.body.author, 'foobar', 'author should be foobar');
            t.same(res.body.title, 'test2', 'title should be test');
            t.end();
        });
})

test('App Project - Creating project3', function(t) {
    t.pass("Creating project with title test success");
    agent
        .post('/add_project/')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({title: "test3"})
        .expect(200)
        .end(function(err, res) {
            t.same(res.body.author, 'foobar', 'author should be foobar');
            t.same(res.body.title, 'test3', 'title should be test');
            t.end();
        });
})

test('App Project - Getting list of project titles', function(t) {
    t.pass("Collecting a list fo all title projects owned by foobar")
    agent
        .get('/get_project_list/')
        .expect(200)
        .end(function(err, res) {
            t.same(res.body.length, 3, 'Size of project list should be 3');
            t.end();
        });
})

test('App Project - Getting a specific project', function(t) {
    t.pass("Getting specific project details");
    project_model.findOne({title:'test', author: 'foobar'}, function(err, project) {
        agent
            .get('/get_project/')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({projectId: project._id})
            .expect(200)
            .end(function(err, res) {
                t.same(res.body.title, 'test', 'title of project should be test');
                t.same(res.body.author, 'foobar', 'author of project should be foobar');
                t.end();
            })
    })
})

test('App Audio - Uploading project', function(t) {
    t.pass("Uploading test.mp3 to test project");
    project_model.findOne({title:'test', author: 'foobar'}, function(err, project) {
        agent
            .post('/upload_track/')
            .field('projectId', String(project._id))
            .field('src', 'test.mp3')
            .field('name', 'test_track')
            .attach('track', __dirname+"/test.mp3")
            .expect(200)
            .end(t.end);
    })
})

test('Mongoose - removing projects by foobar', function(t) {
    project_model.deleteMany({author: 'foobar'}, function(err, n) {
        if (err) return t.ifError(err);
        t.same(n.deletedCount, 3, 'Delete count should be 1');
        t.end();
    });
});

test('Mongoose - removing audio by foobar', function(t) {
    track_model.deleteMany({name: 'test_track'}, function(err, n) {
        if (err) return t.ifError(err);
        t.same(n.deletedCount, 1, 'Delete count should be 1');
        t.end();
    });
});

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