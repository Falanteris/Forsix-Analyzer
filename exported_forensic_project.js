const { exit } = require("process");
const { readFileSync } = require("fs");

var ls = require("./file_listener").listener;

let config = JSON.parse(readFileSync("artifact.json"))
let logfile = config.target_log;
let test_folder = config.test_folder


let EventEmitter = require('events');
const { ping } = require("./checksummer");
class Event extends EventEmitter{}
redisEm = new Event()
//console.log(new_listener);
function runListener(){
	var new_listener = new ls(test_folder,logfile);
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
}
redisEm.on("ready",()=>{
	runListener()
})
function run_prod(){
	let redisPingInt = setInterval(()=>{
		pingRedis()	
	},1000)
	function pingRedis(){
		try{
		ping((status)=>{
				console.log(status)
				if(status){
					console.log("Redis is not available..")
					redisEm.emit("ready")
					clearInterval(redisPingInt)
				}
				// console.log("Redis isn't ready yet..")
				// redisEm.emit("failed")
		
		})
		} catch (error) {
			
			return
		}	
		
		
	}
}
function run_test(){
	runListener()
}
run = {
	"production":run_prod,
	"testing":run_test
}
run[config["mode"]]()