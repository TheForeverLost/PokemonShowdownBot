chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.sync.set({color: '#3aa757'}, function() {
  //   console.log('The color is green.');
  // });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'play.pokemonshowdown.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  console.log(msg,sender)
  $.post({
    type: "POST",
    headers : {
      "Access-Control-Allow-Origin": '*',
      'Content-Type': 'application/json'
    },
    url: "https://kpld3vd283.execute-api.ap-south-1.amazonaws.com/default/pokemonTeamAssistant",
    data: msg
  },(response)=>{
    console.log(response)
  });
});
