  var fs = require("fs");
module.exports = class dirWatcherThread{
        constructor(elem_id,getDir){
          this.id = elem_id;
          this.getDir = getDir 
        }
        async start(){
          this.process = setInterval(()=>{
          
          var res = fs.readFileSync(`${this.getDir}.txt`);
          
          this.appendContent(res.toString(),this.id);
          },2000)
        }
        async stop(){
          clearInterval(this.process);
        }

      appendContent(content,id){
        var getViewer = document.getElementById(id);

        var label = document.createElement("div");
        label.classList.add("logContent");
        label.innerHTML = content         
        getViewer.innerHTML = label.innerHTML
        
      }
      }