var connect = require('connect');
console.log('Starting server on port 8020');
connect.createServer(
    connect.static(__dirname)
).listen(8020);