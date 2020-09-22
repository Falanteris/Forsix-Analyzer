var listener = require("./file_listener").listener;

var instance = new listener(process.argv[2],process.argv[3]);
instance.listen();
