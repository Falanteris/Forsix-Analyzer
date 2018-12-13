var fs = require('fs');
var readline = require('readline');
var crypto = require('crypto');


module.exports = class dirListener{
	constructor(dir,logfile="dirlog.txt"){
			this.dir = dir
			
			
			
			
			this.contents = fs.readdirSync(dir);
			

			this.meta_name = logfile
			console.log(this.meta_name);
			this.logfile_name = logfile+".txt";
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
			 		
					var meta = fs.statSync(dir+"\\"+files);

					console.log(meta);	
						var hash = crypto.createHash("sha256");
					
						hash.update(JSON.stringify(meta));
						var meta = hash.digest();
						var	check_sum_ref = "{name:"+files+"hash:"+meta+"}";
						fs.appendFileSync(this.meta_name+".json",check_sum_ref+"\n");
			}
			catch{

				console.log(`Failed to read and append meta of ${dir}`);
			}					
	}
	detActivity(event,file){
		if(file == this.logfile_name || file == this.meta_name){
			return
		}
		var activity = this.activity.split("|");
		var activ = "";
		let index;
		for(index in activity){
			activ+=activity[index];
		}
		console.log(activ)

		

		if(event == "rename"){

		if(activ.search("Missing")!=-1){
			this.log("<br>"+file + " metadata's missing <br>");
			this.activity = "";
			return;
		}
		if(activ.search("Found")!=-1){
			this.log("<br>"+file + " is a new file..<br>")
			this.activity = "";
			return
		}

		}
		if(event =="change"){
			this.log("<br>"+file + " was modified <br>");
			this.activity = "";
			return
		}
	}
	log(input){
				
				
				fs.appendFileSync(this.logfile_name,input+"\n")

	}
	listen(){
		this.activity = "";
		console.log(`Attemtping to start listening activity on ${this.dir}`);
		var changes = "";
		let activity;
		this.listener = fs.watch(this.dir, (event,filename,err) => {
			if(err) this.err = err;
	
			try{
				console.log(this.dir+"\\"+filename);
				var file = fs.statSync(this.dir+"\\"+filename);
				var read_meta = fs.readFileSync(this.meta_name+".json", 'utf8');
				console.log("File type : " + typeof(file));

				if(typeof(file)=="object"){
					console.log(file);
					this.activity+="Found";
				}
				
			}
			catch{
				
				console.log("Error in extracting meta..file might be moved or deleted");
				this.activity+="Missing";
				
			}
			var prom_detect = new Promise(function(resolve,reject){
				setTimeout(resolve(filename),1000);
			}).then((file)=>{
				this.detActivity(event,file);
			}).catch((nocool)=>{
				console.log("An Error Occured..");
			})
			
		});
	}
}
//**meta function is to input hased meta values


