let {spawn,spawnSync} = require("child_process")
let {readFileSync} = require("fs")
let {equal} = require("assert")
let global_conf = JSON.parse(readFileSync("artifact.json"));

spawnSync("mkdir", [global_conf.test_folder])


spawnSync("forever", ["--sourceDir",process.cwd(),"start","exported_forensic_project.js",global_conf.test_folder,global_conf.target_log])

setTimeout(()=>{
    let tester = spawnSync("node",["testscript.js"])
    equal(tester.stderr.toString().length,0)
    console.log("[!] Stopping Services...")
    spawnSync("forever", ["stopall"])
    console.log("[!] Removing Logs...")
    spawnSync("rm", [global_conf.target_log])
    console.log("[!] Removing Tests...")
    spawnSync("rm", ["-rf",global_conf.test_folder])
},200);