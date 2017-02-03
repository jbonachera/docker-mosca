var mosca = require('mosca')
var winston = require('winston');
var logger = new (winston.Logger)({
        transports: [
                  new (winston.transports.Console)({'timestamp':true})
                ]
});

logger.level = 'info'

var ascoltatore = {
          type: 'kafka',
          kafka: require("kafka-node"),
          connectionString: "172.20.0.42:2181",
          clientId: "ascoltatori",
          groupId: "ascoltatori",
          defaultEncoding: "utf8",
          encodings: {
            image: "buffer"
          }
    }
var settings = {
    id: 'mosca',
    port: process.env.NODE_PORT || 1883,
    logger: { name: 'MoscaServer', level: 'debug' },
    stats: false,
    publishNewClient: false,
    publishClientDisconnect: false,
    publishSubscriptions: false,

}

if (process.env.ZK_STRING != undefined) {
    logger.log('info', 'will use zookeeper at '+process.env.ZK_STRING)
    settings['backend'] = ascoltatore 
};


function server(settings) {

    var server = new mosca.Server(settings);
    return server
}

var app = new server(settings);

app.on("error", function (err) {
    logger.log('info', err);
});

app.on("ready", function () {
    logger.log('info', 'mosca started!');
});
