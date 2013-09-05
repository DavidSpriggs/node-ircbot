var config = {
	server: "irc.freenode.net",
	nick: "esriBot",
	options: {
		userName: 'esriBot',
		realName: 'ESRI STL office node bot',
		port: 6667,
		debug: false,
		showErrors: false,
		autoRejoin: true,
		autoConnect: true,
		channels: ['#esri']
	}
};

// Get the lib
var irc = require("irc");
var mongojs = require('mongojs');

// connect to mongodb
var db = mongojs('ircBot1', ['karma']);

// Create the bot
var bot = new irc.Client(config.server, config.nick, config.options);

// Listen for joins
bot.addListener("join", function(chan, nick) {
	// Welcome them in!
	if (nick !== config.nick) {
		bot.say(chan, nick + ": Welcome back! Feel free to ask any questions! Give props using karma: nick++ or any term: work-- or weekend++");
	}
});

//karma
var plusOne = /^([\w]*)\+{2}$/i;
var minusOne = /^([\w]*)\-{2}$/i;
var printAll = /^!karma!$/i;
var karma = {};

bot.addListener('message', function(nick, chan, text, message) {
	if (printAll.test(text)) {
		bot.say(chan, 'Listing all karma:');
		db.karma.find().sort({
			term: 1
		}, function(err, docs) {
			docs.forEach(function(doc) {
				bot.say(chan, doc.term + ' has ' + doc.karma + ' karma');
			});
		});
	} else {
		var term;
		if (plusOne.test(text)) {
			term = text.match(plusOne)[1];
			db.karma.findOne({
				term: term
			}, function(err, doc) {
				if (!doc) {
					db.karma.save({
						term: term,
						karma: 1
					});
					bot.say(chan, term + ' has 1 karma');
				} else {
					db.karma.update({
						term: term
					}, {
						$inc: {
							karma: 1
						}
					}, {
						multi: false
					}, function() {
						// the update is complete
						bot.say(chan, term + ' has ' + (doc.karma + 1) + ' karma');
					});
				}
			});
		}
		if (minusOne.test(text)) {
			term = text.match(minusOne)[1];
			db.karma.findOne({
				term: term
			}, function(err, doc) {
				if (!doc) {
					db.karma.save({
						term: term,
						karma: -1
					});
					bot.say(chan, term + ' has -1 karma');
				} else {
					db.karma.update({
						term: term
					}, {
						$inc: {
							karma: -1
						}
					}, {
						multi: false
					}, function() {
						// the update is complete
						bot.say(chan, term + ' has ' + (doc.karma - 1) + ' karma');
					});
				}
			});
		}
	}
});

//listen for errors
bot.addListener('error', function(message) {
	console.log('error: ', message);
});