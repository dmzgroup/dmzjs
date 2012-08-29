var list = []
  ;

window.onload = function() {
   var root = document.getElementById("dmzunit") 
     , ix = 0
     ;

   if (root) {
      for (ix = 0; ix < list.length; ix++) {
         root.appendChild(list[ix]);
      }
   }
   else { console.error('Element not found!'); }
};

exports.start = function (name) {
   var div = document.createElement('div')
     ;
   div.setAttribute('class', 'dmzstart');
   div.innerHTML = '<div class="dmzhead"></div><div class="dmztitle">' + name + '</div>';
   list.push(div);
   console.log("Start " + name);
};

exports.validate = function (str, value) {
   var div = document.createElement('div')
     , statusMsg = (value ? "Passed" : "Failed")
     ;
   div.setAttribute('class', 'dmzresult');
   div.innerHTML = '<span class="dmzresultstatus">' + statusMsg +
      '</span><span class="dmzresultmessage">' + str + '</span>';
   list.push(div);
   console.log(statusMsg + ":" + str);
}

exports.stop = function () {
   var div = document.createElement('div')
     ;
   div.setAttribute('class', 'dmzstop');
   div.innerHTML = '<div class="dmztail"></div>';
   list.push(div);
   console.log("Stop");
}
