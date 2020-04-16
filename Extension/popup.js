let start = document.getElementById('start');


function refresh(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log(response.team);
    });
  });
}

start.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {file:"handleteams.js"});
    });
    start.onclick = refresh
    // document.getElementById("databox").innerHTML = "<h1>Hi this works</h1>"
    document.body.style.width = "400px"
    document.body.style.height = "500px"
    $("#databox").text("welcome to teambuilder")
  };



chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if(msg["team"].length == 0){
    param = {}
  }else{
    tag = msg["team"][0]
    for(let i = 1 ; i < msg["team"].length ; i++ ){
      tag  = tag + "_" + msg["team"][i]
    }
    param={
      team : tag
    }
    console.log(param)
  }
  $.get('http://localhost:9000',param, function(data){
      console.log(data)
      response(data)
  })
});