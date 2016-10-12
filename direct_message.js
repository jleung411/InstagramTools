var fs = require('fs');
var _ = require('underscore');
var async = require("async");
var Promise = require('bluebird');
var Client = require('instagram-private-api').V1;

fs.readFile('config.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var json = JSON.parse(data);
    var username = json.username;
    var password = json.password;
    var devicename = json.device;
    var followersfile = json.followers;
    var excludesfile = json.excludes;

    var device = new Client.Device(devicename);
    var storage = new Client.CookieFileStorage(__dirname + '/cookies/' + devicename + '.json');
    Client.Session.create(device, storage, username, password)
        .then(function(session) {
            return [session, session.getAccountId()]
        })
        .spread(function(session, accountId) {

          var cache = {};

          function readAsync(file, callback) {
              fs.readFile(file, 'utf8', callback);
          }
          async.map([followersfile, excludesfile], readAsync, function(err, results) {
              cache[file]=data;
          })
        });
});
