var fs = require('fs');
var _ = require('underscore');
var Promise = require('bluebird');
var Client = require('instagram-private-api').V1;
const winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({'timestamp':true})
    ]
});

Promise.promisifyAll(fs);

var config = {};
var followers = [];
var excludes = [];
var messages = [];

// max recipient user list size: 15 users
const NUM_RECIPIENTS = 15;

fs.readFileAsync('config.json', 'utf-8')
.then(JSON.parse)
.then(function (json) {
    config = json;
    logger.level = config.log_level;
    return fs.readFileAsync(config.messages, 'utf-8');
})
.then(JSON.parse)
.then(function (json) {
    messages = json;
    return fs.readFileAsync(config.followers, 'utf-8');
})
.then(JSON.parse)
.then(function (json) {
    followers = Object.keys(json);
    return fs.readFileAsync(config.excludes, 'utf-8');
})
.then(JSON.parse)
.then(function (json) {
    excludes = Object.keys(json);
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
.then(function () {
    var recipients = _.without.apply(_, [followers].concat(excludes));
    return new Promise(function(resolve, reject) {
        var sendMessage = function(recipients_users, message) {
            var userList = _.first(recipients_users, NUM_RECIPIENTS)
            if (message.mediaId) {
                return Client.Thread.configureMediaShare(config.session, userList, message.mediaId, message.text).delay(3000).then(function(results) {
                    logger.log('debug', 'mediaId: ', message.mediaId, ' and \"', message.text, '\" sent to', userList);
                    var nextuserList = _.rest(recipients_users, NUM_RECIPIENTS)
                    if (nextuserList.length > 0) {
                        sendMessage(nextuserList, message);
                    }
                    else {
                        return;
                    }
                });
            }
            else {
                return Client.Thread.configureText(config.session, userList, message.text).delay(3000).then(function(results) {
                    logger.log('debug', '\"', message.text, '\" sent to', userList);
                    var nextuserList = _.rest(recipients_users, NUM_RECIPIENTS)
                    if (nextuserList.length > 0) {
                        sendMessage(nextuserList, message);
                    }
                    else {
                        return;
                    }
                });
            }
        };
        var testRecipients = [346074560, 12945252, 1751651899, 12945252, 346074560,
                            346074560, 12945252, 1751651899, 12945252, 346074560,
                            346074560, 12945252, 1751651899, 12945252, 346074560,
                            346074560, 12945252, 1751651899, 12945252, 346074560,
                            346074560, 12945252, 1751651899, 12945252, 346074560]
        _.each(messages, function (message) { sendMessage(testRecipients, message); });
    });
})
.then(function (thread) {
    console.log(thread);
})
.catch(SyntaxError, function (e) {
    console.error(e);
})
.catch(function (e) {
    console.error(e);
});
