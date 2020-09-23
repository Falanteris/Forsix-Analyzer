let global_conf = JSON.parse(readFileSync("artifact.json"));

console.log("[!] Removing Logs...")
spawnSync("rm", [global_conf.target_log])
console.log("[!] Removing Tests...")
spawnSync("rm", ["-rf",global_conf.test_folder])