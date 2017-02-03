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
          connectionString: process.env.ZK_STRING,
          clientId: "ascoltatori",
          groupId: "ascoltatori",
          defaultEncoding: "utf8",
          encodings: {
            image: "buffer"
          }
    }
var settings = {
            port: process.env.NODE_PORT || 1883
}

if (process.env.BACKEND != "memory") {
    settings['backend'] = ascoltatore 
};


function server(settings) {

    logger.log('info', 'starting MQTT broker');
    if (process.env.BACKEND != "memory") {
        logger.log('info', 'will use Kafka broker with zookeeper:' + process.env.ZK_STRING,)
    }
    var server = new mosca.Server(settings, function(){});
    return server
}

var app = new server(settings);

app.on('clientConnected', function(client) {
    logger.log('info', 'client connected ' + client.id);
});

app.on('ready', function() {
    logger.log('info', 'MQTT Server listening on port ' + settings.port)
});

app.on("error", function (err) {
    logger.log('error', err);
});
