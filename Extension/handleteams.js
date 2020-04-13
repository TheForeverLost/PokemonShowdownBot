function onload(){
    let input = document.getElementsByName("pokemon")
    let x  = localStorage.getItem("showdown_teams")
    
    let items = []
    x = x.split("]")
    for (let index = 1; index < x.length; index++) {
        let element = x[index];
        element = element.replace("beta|","")
        items.push(element.split("|")[0].toLowerCase())
    }
    console.log(items)
    fetch("http://localhost:5000/", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({"team":items}) // body data type must match "Content-Type" header
      })
    .then((response) => {
        return response.body;
    })
    .then((data) => {
        console.log(data);
    });
}
onload();

