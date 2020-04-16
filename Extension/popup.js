let start = document.getElementById('start');

  
start.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {file:"handleteams.js"});
    });
  };

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    // First, validate the message's structure.
    console.log(msg,sender)
    if(msg["team"].length > 0){
      param = {}
    }else{
      tag = msg["team"][0]
      for(let i = 1 ; i < msg["team"].length ; i++ ){
        tag  = tag + "_" + msg["team"][0]
      }
      param={
        team : tag
      }
    }
    $.get('http://localhost:9000',param, function(data){
        console.log(data)
    });
  });