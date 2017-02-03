var mosca = require('mosca')

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

  var server = new mosca.Server(settings, done);
  function done() {}
  return server
}

var app = new server(settings);

app.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

app.on('ready', function() {
  console.log('MQTT Server listening on port', settings.port)
});
