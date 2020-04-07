function onload(){
    let input = document.getElementsByName("pokemon")
    let x  = localStorage.getItem("showdown_teams")
    x = x.split("]")
    x.forEach(element => {
        let li = element.split("|")
        li.forEach(element2 => {
            console.log(element2)
        });
    });
}
onload();

