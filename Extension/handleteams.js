function onload(){
    let input = document.getElementsByName("pokemon")
    let x  = localStorage.getItem("showdown_teams")
    
    let items = []
    x = x.split("]")
    for (let index = 1; index < x.length-1; index++) {
        let element = x[index];
        element = element.replace("beta|","")
        items.push(element.split("|")[0].toLowerCase())
    }
    console.log(items)
    chrome.runtime.sendMessage({
        team:items // or whatever you want to send
    });
}

onload();

