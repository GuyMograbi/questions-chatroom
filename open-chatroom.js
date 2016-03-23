'use strict';

// separated to a script to support nodemon nicely.

var port = parseInt(process.env.PORT || 3000, 10);

setTimeout(() => {
    require('open')('http://localhost:' + port);
}, 500); // have a delay because the server will take time to load -- a better solution would be to listen on port 3000
