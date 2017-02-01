var mosca = require('mosca')

var settings = {
            port: process.env.NODE_PORT || 1883,
        };

function server(settings) {

  var server = new mosca.Server(settings, done);
  function done() {}
  return server
}

var app = new server(settings);

app.on('published', function(packet, client) {
  if (packet.topic.indexOf('$SYS') === 0) return; // doesn't print stats info
    console.log('ON PUBLISHED', packet.payload.toString(), 'on topic', packet.topic);
});

app.on('ready', function() {
  console.log('MQTT Server listening on port', settings.port)
});
