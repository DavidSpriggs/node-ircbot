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

// Create the bot
var bot = new irc.Client(config.server, config.nick, config.options);

// Listen for joins
bot.addListener("join", function(chan, nick) {
	// Welcome them in!
	if (nick !== config.nick) {
		bot.say(chan, nick + ": Welcome back! Feel free to ask any questions! Give props using karma: nick++ or nick-- or any term: work-- or weekend++");
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
		for (var i in karma) {
			bot.say(chan, i + ' has ' + karma[i] + ' karma');
		}
	} else {
		var p;
		if (plusOne.test(text)) {
			p = text.match(plusOne)[1];
			if (karma[p] !== undefined) {
				karma[p] = karma[p] + 1;
			} else {
				karma[p] = 1;
			}
		}
		if (minusOne.test(text)) {
			p = text.match(minusOne)[1];
			if (karma[p] !== undefined) {
				karma[p] = karma[p] - 1;
			} else {
				karma[p] = -1;
			}
		}
		bot.say(chan, p + ' has ' + karma[p] + ' karma');
	}
});

//listen for errors
bot.addListener('error', function(message) {
	console.log('error: ', message);
});