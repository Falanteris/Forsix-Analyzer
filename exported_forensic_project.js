const { exit } = require("process");
const { readFileSync } = require("fs");

var ls = require("./file_listener").listener;

let config = JSON.parse(readFileSync("artifact.json")).
let logfile = config.target_log;
let test_folder = config.test_folder

var new_listener = new ls(test_folder,logfile);

//console.log(new_listener);

var attempt_prm = new Promise(function(resolve,reject){
	try{
		new_listener.listen();
		resolve("Attempt Success");
	}
	catch(error){
		console.log(error)
		reject(new Error("Listen Attempt Error"));	
	}
}).then((result) =>{
	console.log(result);

}).catch((err) => {
	console.log(err);
	exit();
}).then(() => {
	console.log(" End Of Attempt..");
});
