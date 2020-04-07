let start = document.getElementById('start');

  
start.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {file:"handleteams.js"});
    });
  };

