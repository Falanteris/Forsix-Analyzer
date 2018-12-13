
        
      function appendContent(content,id){
        var getViewer = document.getElementsByClassName("listener");

        var label = document.createElement("div");
        label.classList.add("logContent");
       
        getViewer.getElementById(id).innerHTML = label.innerHTML
        
      }
      function newFileLsDiv(){
     
        var getViewer = document.getElementsByClassName("listen_holder")[0];
        
        var label = document.createElement("div");
        
        label.classList.add("listener");
        
        label.id = getViewer.getElementsByClassName("listener").length;

        getViewer.appendChild(label);
        return label.id
        
      }

      document.addEventListener("submit", (e) =>{
        e.preventDefault();
                var getDir = document.forms.item(0).dirname.value;
        
        var ls = require('./file_listener.js');
        var path = require("path");
        
        var getPath = path.normalize(process.cwd()+"\\"+getDir)
        
        if(getDir.length == 0 || getDir == "/"){
          getDir = "Main";
        }
        var new_listener = new ls(getPath,getDir);
        var id = newFileLsDiv();
        document.getElementById(id).innerHTML = `Listening on..${getPath}`
        const dirWatch = require("./div_listener.js");

        var file_read =  new dirWatch(id,getDir);
        file_read.start();
var attempt_prm = new Promise(function(resolve,reject){

    new_listener.listen();
    if(new_listener.err!=undefined){
      reject(new Error("Folder Not Found.."));
    }
    resolve("Attempt Success");

}).then((result) =>{
    
}).catch((err) => {
 alert("NYEET")
}).then(() => {
  console.log(" End Of Attempt..");
}); 


      })
      