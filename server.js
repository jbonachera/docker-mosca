var mosca = require('mosca')
var winston = require('winston');
var logger = new (winston.Logger)({
        transports: [
                  new (winston.transports.Console)({'timestamp':true})
                ]
});

logger.level = 'info'

var backend = {
    type: "kafka",
    redis: require('kafka-node'),
    json: false,
    connectionString: process.env.ZK_STRING,
    clientId: "mosca",
    groupId: "mosca",
    defaultEncoding: "utf8",
};

var settings = {
    id: 'mosca',
    port: process.env.NODE_PORT || 1883,
    logger: { name: 'mosca', level: 'debug' },
    defaultEncoding: "utf8",
    stats: false,
    publishNewClient: false,
    publishClientDisconnect: false,
    publishSubscriptions: false,
}

if (process.env.ZK_STRING != undefined) {
    logger.log('info', 'will use zookeeper at '+process.env.ZK_STRING)
    settings['backend'] = backend
};


function server(settings) {
    var server = new mosca.Server(settings);
    return server
}

var app = new server(settings);

app.on("error", function (err) {
    console.log(err);
});


app.on('clientConnected', function (client) {
    console.log('Client Connected \t:= ', client.id);
});

app.on('published', function (packet, client) {
    console.log("Published :=", packet);
});

app.on('subscribed', function (topic, client) {
    console.log("Subscribed :=", topic);
});

app.on('unsubscribed', function (topic, client) {
    console.log('unsubscribed := ', topic);
});

app.on('clientDisconnecting', function (client) {
    console.log('clientDisconnecting := ', client.id);
});

app.on('clientDisconnected', function (client) {
    console.log('Client Disconnected     := ', client.id);
});
