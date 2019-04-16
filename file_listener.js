var fs = require('fs');
var readline = require('readline');
var crypto = require('crypto');
var path = require("path")

exports.listener = class dirListener{
	constructor(dir,logfile="dirlog.txt"){
			this.dir = dir;
			this.contents = fs.readdirSync(path.normalize(dir));
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
			console.log(this.meta_name);
			this.logfile_name = logfile;
			
			var dir_read = fs.readdirSync(this.dir);
			let content;
			for(content in dir_read){
				this.meta(this.dir,dir_read[content]);
			}
			var date = new Date();
			var date_str = `${date.getFullYear()} - ${date.getMonth()} - ${date.getDay()} -${date.getDate()}  | ${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()} \n`;	
			var inst = ` -------Log created at : ${date_str}----- `;
			fs.appendFileSync(this.logfile_name,inst+"\n");

	}
	meta(dir,files){
			try{
			 		console.log(dir+this.splitter+files)
					var meta = fs.statSync(dir+this.splitter+files);

					
						
						
						var	check_sum_ref =  `{ name:${files} , hash:${JSON.stringify(meta)}}`;
						fs.appendFileSync(this.meta_name,check_sum_ref+"\n");
			}
			catch(error){

				console.log(`Failed to read and append meta of ${dir}`);
			}					
	}
	detActivity(event,file){
		var activity = this.activity.split("|");
		var activ = "";
		let index;
		for(index in activity){
			activ+=activity[index];
		}


		

		if(event == "rename"){

		if(activ.search("Missing")!=-1){
			console.log(`${file} has been deleted`);
			this.activity = "";
			this.log(`${file} has been deleted`)
		}
		if(activ.search("Found")!=-1){
			console.log(`${file} is a new file..`)
			this.activity = "";
			this.log(`${file} is a new file`)
		}

		}
		if(event =="change"){
			console.log(`${file} was modified`);
			this.activity = "";
			this.log(`${file} was modified`)
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
		this.activity = "";
		console.log(`Attemtping to start listening activity on ${this.dir}`);
		var changes = "";
		let activity;
		this.listener = fs.watch(this.dir, (event,filename,err) => {
			if(err) throw err;
	
			try{
				console.log(this.dir+this.splitter+filename);
				var file = fs.statSync(this.dir+this.splitter+filename);
				var read_meta = fs.readFileSync(this.meta_name, 'utf8');
				console.log("File type : " + typeof(file));

				if(typeof(file)=="object"){
					console.log(file);
					this.activity+="Found";
				}
				
			}
			catch(error){
				console.log(error)
				console.log("Error in extracting meta..file might be moved or deleted");
				this.activity+="Missing";
				
			}
			var prom_detect = new Promise(function(resolve,reject){
				setTimeout(resolve(filename),1000);
			}).then((file)=>{
				console.log(event)
				this.detActivity(event,file);
			}).catch((nocool)=>{
				console.log("An Error Occured..");
			})
			
		});
	}
}
//**meta function is to input hased meta values


