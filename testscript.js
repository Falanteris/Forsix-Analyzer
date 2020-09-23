let {spawn} = require("child_process");
let {spawnSync} = require("child_process");
let {notDeepStrictEqual} = require("assert");
let {readFileSync} = require("fs");

Array.prototype.remove = function() {
    let a = arguments[0], temp;
    while((temp = this.lastIndexOf(a)) > -1){
        if(temp == -1) break;
        this.splice(temp,1)
    }

    return this;
};

let global_conf = JSON.parse(readFileSync("artifact.json"));
   
//spawnSync("docker",["run","-d","--name",global_conf.containerName,"forsix-test"])

try { 
    console.log("[!] Testing for modified/creation..")

    
    for (let index = 0; index < global_conf.testsArgs.length; index++) {
        
        switch(global_conf.testsArgs[index]["type"]){
            case "dir":
                spawnSync("mkdir",["-p",global_conf.testsArgs[index].name])
                let d = spawnSync("tail",["activity.log"])
                console.log(d)
                console.log("Currently tested : " + global_conf.testsArgs[index].name)
                let dat = d.stdout.toString().split("\n")
                notDeepStrictEqual(dat.remove('')[dat.length-1].search(global_conf.testsArgs[index].name),-1)

                break;
    
            case "file":
                spawnSync("touch",[global_conf.testsArgs[index].name]);
                let d2= spawnSync("tail",["activity.log"])
                console.log(d2)
                console.log("Currently tested : " + global_conf.testsArgs[index].name)
                let dat2 = d2.stdout.toString().split("\n")
                notDeepStrictEqual(dat2.remove('')[dat2.length-1].search(global_conf.testsArgs[index].name),-1)
                break
            default:
                console.log("Uhhh")
                break
        }
        
    }
    
    console.log("[!] Testing for deletion activity..")
    for (let index = global_conf.testsArgs.length-1; index >= 0; index--) {
        switch(global_conf.testsArgs[index].type){
            case "dir":
                spawnSync("mkdir",["-p",global_conf.testsArgs[index].name])
                let d = spawnSync("tail",["activity.log"])
                console.log(d.stderr.toString())
                console.log("Currently tested : " + global_conf.testsArgs[index].name)
                let dat = d.stdout.toString().split("\n")
                notDeepStrictEqual(dat.remove('')[dat.length-1].search(global_conf.testsArgs[index].name),-1)
                break;
            case "file":
                spawnSync("touch",[global_conf.testsArgs[index].name]);
                let d2= spawnSync("tail",["activity.log"])
                console.log(d2.stderr.toString())
                console.log("Currently tested : " + global_conf.testsArgs[index].name)
                let dat2 = d2.stdout.toString().split("\n")
                notDeepStrictEqual(dat2.remove('')[dat2.length-1].search(global_conf.testsArgs[index].name),-1)
                break;
            default:
                    console.log("Uhhh")
                    break
        }
        
    }
    // console.log("[+] Tests are passed successfully... stopping and removing container..")
    // spawnSync("docker",["container","stop",global_conf.containerName]) ;
    // spawnSync("docker",["container","rm",global_conf.containerName]) ;
    console.log("[+] Tests are finished")
    process.exit(0)
    
} catch (error) {

    throw error
} finally{
    // spawnSync("docker",["container","stop",global_conf.containerName]) ;
    // spawnSync("docker",["container","rm",global_conf.containerName]) ;
    console.log("[-] Tests failed..")
} 
// }
// let global_conf = {
//     "containerName":"forsix",
//     "testsArgs":[{"type":"dir","name":"tests/abc"},{"type":"file","name":"tests/main.txt"},{"type":"file","name":"tests/abc/hidden.txt"}],


// }
// let log_output= [];

// spawnSync("docker",["run","-d","--name",global_conf.containerName,"forsix-test"])
// console.log("[!] Performing initial setup, listening to log file")
// let log = spawn("docker", ["exec", "forsix","tail","-f","activity.log"])

// log.stdout.on("data",(data)=>{
//     let item_new = data.toString().split(":");
//     console.log(item_new)
//     log_output.push(item_new)
    
// })
// log.stderr.on("data",(err)=>{

//     console.log("ERROR: "+err);
// })

// for (let index = 0; index < global_conf.testsArgs.length; index++) {
//     switch(global_conf.testsArgs[index].type){
//         case "dir":
//             spawnSync("docker",["exec","forsix","mkdir","-p",global_conf.testsArgs[index].name])
            
//             break;

//         case "file":
//             spawnSync("docker",["exec","forsix","touch",global_conf.testsArgs[index].name]);
            
//             break
//     }
    
// }

// console.log("[!] Testing for deletion activity..")
// for (let index = global_conf.testsArgs.length-1; index >= 0; index--) {
//     switch(global_conf.testsArgs[index].type){
//         case "dir":
//             spawnSync("docker",["exec","forsix","rm","-rf",global_conf.testsArgs[index].name])
//             break;
//         case "file":
//             spawnSync("docker",["exec","forsix","rm",global_conf.testsArgs[index].name]);
//             break
//     }
    
// }
// console.log(log_output)
// console.log("[+] Tests are passed successfully")







