let crypto = require("crypto");
//let assert = require("assert");

let event = require("events");

const { fstat, fsync, readFileSync, writeFileSync } = require("fs");

class Emitter extends event{}



let checkSumWithRedisData = (filename,cb)=>{
    let redis = require("redis");
    let redisConfig = JSON.parse(readFileSync("artifact.json")).redis
    let client = redis.createClient("redis://"+redisConfig.host+":"+redisConfig.port)
    // let sharedState = [];
    let dataToRead = readFileSync(filename).toString();
    // let h1 = crypto.createHash("md5");
    let h1 = crypto.createHash("md5");
    h1.on("data",(data)=>{
        //implementing normal fs r/w, possibly gonna try redis later on?

        // writeFileSync(filename+".sum",data);
        
        //now implementing redis

        client.get(filename+".sum",(err,redisData="")=>{
            if(err){
                console.log(err);
                return;
            }
            let comparison = Buffer.compare(data,Buffer.from(redisData))
            console.log(comparison)
            if(comparison!=0){
                cb(new Error("File has changed.."));
            }
            else{
                cb(null)
            }   
            
            
        });
        
    })
    
    h1.write(dataToRead)
    h1.end();
    // let h2 = crypto.createHash("md5");
    // let comparerEvent = new Emitter();
    // comparerEvent.on("data",(data)=>{
    //     sharedState.push(data);
    //     if(sharedState.length == 2){
    //         comparerEvent.emit("complete",sharedState);
    //     }

    // })
    // comparerEvent.on("complete",(results)=>{
    //     assert.deepStrictEqual(results[0].toString(),results[1].toString());
    // })
    // h1.on("data",(data)=>{
    //     comparerEvent.emit("data",data);
    // });
    // h2.on("data",(data)=>{
    //     comparerEvent.emit("data",data)
    // })
    // h1.write(data1);
    // h2.write(data2);
    // h1.end();
    // h2.end();
    
}
let setMD5Sum = (filename)=>{
    let redis = require("redis");
    let redisConfig = JSON.parse(readFileSync("artifact.json")).redis
    let client = redis.createClient("redis://"+redisConfig.host+":"+redisConfig.port)
    let dataToRead = readFileSync(filename).toString();
    let h1 = crypto.createHash("md5");
    h1.on("data",(data)=>{
        //implementing normal fs r/w, possibly gonna try redis later on?

        // writeFileSync(filename+".sum",data);
        
        //now implementing redis
        console.log(data)
        client.set(filename+".sum",data);
        
    })
    h1.write(dataToRead)
    h1.end();

}

module.exports = {
    checkSum:checkSumWithRedisData,
    setMD5Sum:setMD5Sum
}
