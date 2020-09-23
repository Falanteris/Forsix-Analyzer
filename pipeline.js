let {spawn,spawnSync} = require("child_process")
let {readFileSync} = require("fs")
let global_conf = JSON.parse(readFileSync("artifact.json"));

spawnSync("mkdir", [global_conf.test_folder])


spawnSync("forever", ["--sourceDir",process.cwd(),"start","exported_forensic_project.js",global_conf.test_folder,global_conf.target_log])

let tester2 = spawnSync("ls")

console.log(tester2.stdout.toString())
setTimeout(()=>{

    let tester = spawnSync("node",["testscript.js"])

    console.log(tester.stdout.toString())
    console.log("[!] Stopping Services...")
    spawnSync("forever", ["stopall"])
    console.log("[!] Removing Logs...")
    spawnSync("rm", [global_conf.target_log])
    console.log("[!] Removing Tests...")
    spawnSync("rm", ["-rf",global_conf.test_folder])
},200);