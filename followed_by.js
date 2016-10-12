var fs = require('fs');
var _ = require('underscore');
var Promise = require('bluebird');
var Client = require('instagram-private-api').V1;

Promise.promisifyAll(fs);

var config = {}
var followers = {};

fs.readFileAsync('config.json', 'utf-8')
.then(JSON.parse)
.then(function (json) {
    config = json;
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
.then(function() {
    var count = 0;
    return new Promise(function(resolve, reject) {
        var feed = new Client.Feed.AccountFollowers(config.session, config.accountId);
        var fetchFollowers = function() {
            return feed.get().delay(1000).then(function(results) {
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
.then(JSON.stringify)
.then(function(output) {
    fs.writeFileAsync(config.followers, output);
})
.then(function () {
    console.log('Followers saved: ' + Object.keys(followers).length);
})
.catch(SyntaxError, function (e) {
    console.error(e);
})
.catch(function (e) {
    console.error(e);
});
