function onload(){
    let input = document.getElementsByName("pokemon")
    let x  = localStorage.getItem("showdown_teams")
    t = x.split('\n')
    t.forEach(x => {
        
        items = getTeam(x)
        console.log(items)    
        chrome.runtime.sendMessage({team: items}, function(response) {
            console.log(response);
        });
    
    });
    
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        onload()
        sendResponse({farewell:"good bye"})
    });

function getTeam(teamstring){
    let re = /(\w+)\|(\w*)\|(\w*)\|(\w+)\|(\w*,?\w*,?\w*,?\w*)\|(\w*)\|(\d*,?\d*,?\d*,?\d*,?\d*,?\d*)\|(\w?)\|(\d*,?\d*,?\d*,?\d*,?\d*,?\d*)\|(\w?)\|(\w*)\|(\d*)/g;
    result = teamstring.matchAll(re)
    team = []
    for(match of result){
        let species , nickname
        if (match[2] == "") {
            nickname = match[2]
            species = match[1] 
        }else{
                nickname = match[1]
                species = match[2]
        }
        console.log("species is ",species.toLowerCase())
        team.push(species.toLowerCase())
    }
    return team
}