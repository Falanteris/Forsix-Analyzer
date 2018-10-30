var fs = require('fs');
var readline = require('readline');
var crypto = require('crypto')

const rl = readline.createInterface({
	input : process.stdin,
	output: process.stdout	

 });
function interpolate(){
rl.question('Input a directory to listen to  ', (answer) =>{
		if(answer == ""){
			interpolate();
			return;
		}
		var see = fs.watch(answer,(event,filename,err)=>{
				
			console.log(event);
			console.log(filename);
			try{

				var file = fs.stat(answer+"\\"+filename, (err,meta) => {
					if(err){
						console.log("error in viewing corresponding file's metadata..moving or deletion possible");
						return;
					};
					console.log(meta);
				});
				console.log(file);
				if(typeof(file)=="object"){
					console.log(file);
				}
			}
			catch{
				console.log("Error in extracting meta..file might be moved or deleted");
			}
			console.log(event);	
				
		});
		see.on("rename",(err,data) => {
				console.log(`${data} has been modified, code : rename`);
	
		});
		see.on("change",(err,data) => {
				console.log(`${data} has been modified, code : change`);
	
		});


})	

}
interpolate();
