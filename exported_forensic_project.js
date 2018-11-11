var ls = require("./file_listener").listener;

var new_listener = new ls("C:\\Users\\RAYHAN","RAYHANlog.txt");

console.log(new_listener);

var attempt_prm = new Promise(function(resolve,reject){
	try{
		new_listener.listen();
		resolve("Attempt Success");
	}
	catch{

		reject(new Error("Listen Attempt Error"));	
	}
}).then((result) =>{
	console.log(result);

}).catch((err) => {
	throw err;
}).then(() => {
	console.log(" End Of Attempt..");
});