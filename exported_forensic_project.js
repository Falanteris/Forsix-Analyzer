const { exit } = require("process");

var ls = require("./file_listener").listener;

var new_listener = new ls(process.argv[2],process.argv[3]);

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
