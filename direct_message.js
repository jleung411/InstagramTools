var fs = require('fs');
var _ = require('underscore');
var Promise = require('bluebird');
var Client = require('instagram-private-api').V1;

Promise.promisifyAll(fs);

var config = {}
var followers = {};
var excludes = {};

fs.readFileAsync('config.json', 'utf-8')
.then(JSON.parse)
.then(function (json) {
    config = json;
    return fs.readFileAsync(config.followers, 'utf-8');
})
.then(JSON.parse)
.then(function (json) {
    followers = json;
    return fs.readFileAsync(config.excludes, 'utf-8');
})
.then(JSON.parse)
.then(function (json) {
    excludes = json;
    var device = new Client.Device(config.device);
    var storage = new Client.CookieFileStorage(__dirname + '/cookies/' + config.device + '.json');
    return Client.Session.create(device, storage, config.username, config.password);
})
.then(function (session) {
    config.session = session;
    return session.getAccountId();
})
.then(function (accountId) {
    config.accountId = accountId;
})
.catch(SyntaxError, function (e) {
    console.error(e);
})
.catch(function (e) {
    console.error(e);
});
