var fs = require('fs');
var readline = require('readline');
var crypto = require('crypto');
exports.listener = class dirListener{
	constructor(dir,logfile="dirlog.txt"){
			this.dir = dir;
			this.contents = fs.readdirSync(dir);
			var paths = this.dir.split("\\");

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
			 		console.log(dir+"\\"+files)
					var meta = fs.statSync(dir+"\\"+files);

					console.log(meta);	
						var hash = crypto.createHash("sha256");
					
						hash.update(JSON.stringify(meta));
						var meta = hash.digest();
						var	check_sum_ref =  `{ name:${files} , hash:${meta}}`;
						fs.appendFileSync(this.meta_name,check_sum_ref+"\n");
			}
			catch{

				console.log(`Failed to read and append meta of ${dir}`);
			}					
	}
	log(input){
		
				fs.appendFile(this.logfile_name,input+"\n",(err) => {
						if(err) console.log(err);
				});

	}
	listen(){
		console.log(`Attemtping to start listening activity on ${this.dir}`);
		this.listener = fs.watch(this.dir, (event,filename,err) => {
			if(err) throw err;
	
			try{
				console.log(this.dir+"\\"+filename);
				var file = fs.statSync(this.dir+"\\"+filename);
				var read_meta = fs.readFileSync(this.meta_name, 'utf8');
				console.log("File type : " + typeof(file));
				if(typeof(file)=="object"){
					console.log(file);
				}
			}
			catch{
			
				console.log("Error in extracting meta..file might be moved or deleted");
			}
			console.log(event);	
		});
		this.listener.on("rename", (err,data) => {
			
			this.log(`${data} has been altered | code : rename`);	
		});
		this.listener.on("change", (err,data) =>{
			this.log(`${data} has been altered | code : change`);	
		});
	}
}
//**meta function is to input hased meta values


