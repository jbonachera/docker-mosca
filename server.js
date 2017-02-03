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
    id: 'mosca',
    port: process.env.NODE_PORT || 1883,
    logger: { name: 'MoscaServer', level: 'debug' },

}

if (process.env.ZK_STRING != undefined) {
    settings['backend'] = ascoltatore 
};


function server(settings) {

    var server = new mosca.Server(settings, function(){});
    return server
}

var app = new server(settings);

app.on("error", function (err) {
    logger.log('error', err);
});
