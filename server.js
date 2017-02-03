var mosca = require('mosca')
var winston = require('winston');
var logger = new (winston.Logger)({
        transports: [
                  new (winston.transports.Console)({'timestamp':true})
                ]
});

winston.level = 'info'

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
  , settings = {
            port: process.env.NODE_PORT || 1883,
            backend: ascoltatore };


function server(settings) {

    logger.log('info', 'starting MQTT broker');
    var server = new mosca.Server(settings);
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
