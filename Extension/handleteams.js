function onload(){
    let input = document.getElementsByName("pokemon")
    let x  = localStorage.getItem("showdown_teams")
    t = x.split('\n')
    let teams = []
    t.forEach(x => {
        let team = getName(x)
        let items = getTeam(x)
        team.team = items
        teams.push(team)    
    });
    console.log(teams)
    chrome.runtime.sendMessage({team: teams}, function(response) {
        console.log(response);
    });

    
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        onload()
        sendResponse()
    });

function getTeam(teamstring){
    let re = /(\w+)\|(\w*)\|(\w*)\|(\w+)\|(\w*,?\w*,?\w*,?\w*)\|(\w*)\|(\d*,?\d*,?\d*,?\d*,?\d*,?\d*)\|(\w?)\|(\d*,?\d*,?\d*,?\d*,?\d*,?\d*)\|(\w?)\|(\w*)\|(\d*)/g;
    result = teamstring.matchAll(re)
    let team = []
    for(match of result){
        let obj = {}
        if (match[2] == "") {
            obj.species = match[1].toLowerCase()
        }else{
             obj.nickname = match[1].toLowerCase()
             obj.species = match[2].toLowerCase()
        }
        if (match[3] != "") {
            obj.item = match[3].toLowerCase()
        }
        if (match[4] != "") {
            obj.ability = match[4].toLowerCase()
        } 
        team.push(obj)
    }
    return team
}

function getName(teamstring){
    let re = /([\w\d]+)]([\w\s\d]+)/g;
    let result = teamstring.matchAll(re)
    for(match of result){
        return {
            format: match[1],
            name: match[2]
        }
    }
}

