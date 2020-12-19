let {spawn,spawnSync} = require("child_process")
let {readFileSync, write} = require("fs")
let {strictEqual} = require("assert")
let global_conf = JSON.parse(readFileSync("artifact.json"));
let current_conf = JSON.parse(readFileSync("artifact.json"));

global_conf["mode"] = "testing"
global_conf["test_folder"] = "anonymous"
console.log(current_conf)
let {writeFileSync} = require('fs');
const { exit } = require("process");
writeFileSync("artifact.json",JSON.stringify(global_conf))

spawnSync("mkdir", [global_conf.test_folder])
spawnSync("mkdir", ["log"])
spawn("npm",["start"])
// spawnSync("forever", ["--sourceDir",process.cwd(),"start","exported_forensic_project.js",global_conf.test_folder,global_conf.target_log])

setTimeout(()=>{
    try {
     
    let tester = spawnSync("node",["testscript.js"])
    
    console.log(tester.stdout.toString());
    
    console.log(tester.stderr.toString())
    
    strictEqual(tester.stderr.toString().length,0)
    
    console.log("[+] Tests executed successfully..")
    
    console.log("[!] Stopping Services...")
    
    spawnSync("forever", ["stop","exported_forensic_project.js"])
    
    console.log("[!] Removing Logs...")
    
    spawnSync("rm", [global_conf.target_log])
    
    console.log("[!] Removing Tests...")
    
    spawnSync("rm", ["-rf",global_conf.test_folder])   
    writeFileSync("artifact.json",JSON.stringify(current_conf))
    exit(0)
    } catch (error) {
        let global_conf = JSON.parse(readFileSync("artifact.json"));
        global_conf["mode"] = "production"
        
    
        console.log("[!] Removing Logs...")
    
        spawnSync("rm", [global_conf.target_log])
    
        console.log("[!] Removing Tests...")
    
        spawnSync("rm", ["-rf",global_conf.test_folder])   
    
        throw error
    }
},3000);
