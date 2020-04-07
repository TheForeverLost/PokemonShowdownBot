chrome.storage.local.get(["showdown_teams"] , function(data){
    var name = JSON.stringify(data)
    document.getElementById("teams_found").innerHTML = name;
});
