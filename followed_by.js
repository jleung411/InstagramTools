var fs = require('fs');
var _ = require('underscore');
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


var device = new Client.Device(devicename);
var storage = new Client.CookieFileStorage(__dirname + '/cookies/' + devicename + '.json');

Client.Session.create(device, storage, username, password)
    .then(function(session) {
        return [session, session.getAccountId()]
    })
    .spread(function(session, accountId) {

        var followers = {};
        var count = 0;


        return new Promise(function(resolve, reject) {
            var feed = new Client.Feed.AccountFollowers(session, accountId);
            var fetchFollowers = function() {
                return feed.get().delay(1000).then(function(results) {
                    // result should be Account[]
                    var accounts = _.flatten(results);
                    _.each(accounts, function(account) {
                        followers[account.id] = account._params.username;
                    });

                    count = count + 1;

                    if (feed.isMoreAvailable() && count < 3) {
                        fetchFollowers();
                    }
                    else {
                        return resolve(followers);
                    }
                });
            };

            fetchFollowers();
        });
    })
    .then(function(followers) {
        fs.writeFile('followers.json', JSON.stringify(followers), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log('Followers saved: ' + Object.keys(followers).length);
        });
    });





});


