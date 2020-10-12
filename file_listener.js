var fs = require('fs');
var readline = require('readline');
var crypto = require('crypto');
var path = require("path")
//let checksumTools = require("./checksummer");
exports.listener = class dirListener{
	constructor(dir,logfile){
			console.log("STARTED FORSIX LISTENER ON :" + dir);
			console.log("LOGFILE : "+logfile)
			this.dir = dir;
			this.contents = fs.readdirSync(path.normalize(dir));
			this.structure = path.parse(this.dir)
			this.activity = new Array();
			if(process.platform=="win32"){
				
				this.splitter = "\\"
				//WIN32
			}
			else{
				this.splitter = "/"
				;
				//UNIX
			}
			var paths = this.dir.split(this.splitter);
			this.meta_name = `${paths[paths.length-1]}.json`;
			this.logfile_name = logfile
			
			var dir_read = fs.readdirSync(this.dir);
			let content;
			this.subdir_listeners = []
			for(content in dir_read){
				let inp = path.normalize(this.dir+this.splitter+dir_read[content])
				try {
					console.log(dir_read[content])
					
					let test_read = fs.readFileSync(inp);
					//this.meta(this.dir,dir_read[content]);	
					//checksumTools.setMD5Sum(inp);
				} catch (error) {
					if(error.code == "EISDIR"){

						let newSubdirListener = new dirListener(inp,this.logfile_name)
						this.subdir_listeners.push(newSubdirListener);

					}
				}
			}
			
			
			let date_str = this.getTimestamp();
			var inst = `listening for new directory ${this.dir} at ${date_str}`;
			fs.appendFileSync(this.logfile_name,inst);

	}
	newdir(){
		fs.appendFileSync(this.meta_name,"{}");
	}
	meta(dir,files){
			try{
					var meta = fs.statSync(dir+this.splitter+files);
					var	check_sum_ref =  `{ name:${files} , hash:${JSON.stringify(meta)}}`;
					fs.appendFileSync(this.meta_name,check_sum_ref+"\n");
			}
			catch(error){

				console.log(`Failed to read and append meta of ${dir}`);
			}					
	}
	getTimestamp(){
		var date = new Date();
		let getDay = date.getDay();
		let getMonth = date.getMonth()
		switch(getDay){
			case 1:
				getDay = "Monday"
				break;
			case 2:
				getDay = "Tuesday"
				break;
			case 3:
				getDay = "Wednesday"
				break;
			case 4:
				getDay = "Thursday"
				break;
			case 5:
				getDay = "Friday"
				break;
			case 6:
				getDay = "Saturday"
				break;
			case 7:
				getDay = "Sunday"
				break;
		}
		switch(getMonth){
			case 0:
				getMonth = "January";
				break;
			case 1:
				getMonth = "February";
				break;
			case 2:
				getMonth = "March";
				break;
			case 3:
				getMonth = "April";
				break;
			case 4:
				getMonth = "May";
				break;
			case 5:
				getMonth = "June";
				break;
			case 6:
				getMonth = "July";
				break;
			case 7:
				getMonth = "August";
				break;
			case 8:
				getMonth = "September";
				break;
			case 9:
				getMonth = "October";
				break;
			case 10:
				getMonth = "November";
				break;
			case 11:
				getMonth = "December";
				break;
				
		}
		
		//var date_str = `${date.getFullYear()} - ${date.getMonth()} - ${date.getDay()} -${date.getDate()}  | ${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()} \n`;
		var date_str = 	`${getDay.slice(0,3)} ${date.getDate()}/${getMonth.slice(0,3)}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n`;
		return date_str;
	}
	detActivity(event,file){
		let activ = this.activity
		let index;
		
		console.log(event);
		if(event == "rename"){
			if(activ[0] == "Missing"){
				let inp = path.normalize(this.dir+this.splitter+file);
				//checksumTools.setMD5Sum(`${inp}`);
				console.log(`${inp} has been deleted..`)
				this.activity.shift();
				var date_str = this.getTimestamp();
				this.log(`DELETED ${inp}@${date_str}`)
			}
	

		if(activ[0] == "Found"){
			var date_str = this.getTimestamp();
			let inp = path.normalize(this.dir+this.splitter+file);
			
			try {
			
				//checksumTools.setMD5Sum(`${inp}`);
				console.log(`${inp} is a new file..`)
				
				this.activity.shift();
				
				this.log(`CREATED ${inp}@${date_str}`)	
			} catch (error) {
				this.log(`${inp}:cannot be read, might be immediate deletion at ${date_str}`)
			}
			
		}

		}
		if(event =="change"){
			
				//console.log(`${this.dir+this.splitter+file}`)
				let inp = path.normalize(this.dir+this.splitter+file);
				this.activity.shift();
				var date_str = this.getTimestamp();
				//let inp = path.normalize(this.dir+this.splitter+file);
				this.log(`MODIFIED ${inp}@${date_str}`)
				
				
			
				//console.log(`${this.dir+this.splitter+file} was modified`);
			
			
		}
	}
	log(input){
				var name = this.logfile_name;
				var prm = new Promise(
					function(resolve,reject){

				fs.appendFile(name,input+"\n",(err) => {
						if(err) reject(err);
						resolve("WRITE SUCCESS");
				});
					}
				).then((res) => {
					console.log("Changes have been written to log file");
				}).catch((err) => {
					console.log(err);
				})

	}
	listen(){
		console.log(`Attemtping to start listening activity on ${this.dir}`);
		var changes = "";
		let activity;
		for(let items in this.subdir_listeners){
			this.subdir_listeners[items].listen();
		}
		this.listener = fs.watch(this.dir, (event,filename,err) => {
			if(err) throw err;
			
			try{
				// console.log(this.dir+this.splitter+filename);
				// var file = fs.statSync(this.dir+this.splitter+filename);
				//var read_meta = fs.readFileSync(this.meta_name, 'utf8');
				if(this.structure.base==filename){
					console.log("[-] Activity on self detected, letting parent listener handle..");
					//ignoring events on self to avoid weird log output
				}
				else{
					let test_read = fs.readFileSync(path.normalize(this.dir+this.splitter+filename));

				// if(typeof(file)=="object"){
				// 	console.log(file);
				// }
				// 
					this.activity.push("Found")
				}
				this.detActivity(event,filename);

				
			}
			catch(error){
				
				if (error.code == "EISDIR"){
					console.log("Detected newly made directory.. hooking it to listener")
					let new_listener = new dirListener(path.normalize(this.dir+this.splitter+filename),this.logfile_name)
					new_listener.listen();
				}
				else{
					console.log("Error in extracting meta..file might be moved or deleted");
					this.activity.push("Missing");
					console.log(error)
					this.detActivity(event,filename);
				}
				
			}
			
			// var prom_detect = new Promise(function(resolve,reject){
			// 	setTimeout(resolve(filename),1000);
			// }).then((file)=>{
			// 	this.detActivity(event,file);
			// }).catch((nocool)=>{
			// 	console.log("An Error Occured..");
			// })
			
		});
	}
}
//**meta function is to input hased meta values


