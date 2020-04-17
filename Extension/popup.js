let start = document.getElementById('start');

function refresh(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    });
  });
}

let pokemonTeams = {}

start.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {file:"handleteams.js"});
    });
    start.onclick = refresh
    // document.getElementById("databox").innerHTML = "<h1>Hi this works</h1>"
    
  };



chrome.runtime.onMessage.addListener((msg, sender, response) => {
  $('#databox').replaceWith('<main id="databox"> <div id="blank" class="container"></div><div id="result">Click on team to get started</div> </main>')
  // First, validate the message's structure.
  // if(msg["team"].length == 0){
  //   param = {}
  // }else{
  //   tag = msg["team"][0]
  //   for(let i = 1 ; i < msg["team"].length ; i++ ){
  //     tag  = tag + "_" + msg["team"][i]
  //   }
  //   param={
  //     team : tag
  //   }
  //   console.log(param)
  // }
  // $.get('http://localhost:9000',param, function(data){
  //     console.log(data)
  //     response(data)
  // })
  document.body.style.width = "400px"
  document.body.style.height = "500px"
  pokemonTeams={}
  msg["team"].forEach(element=>{
    if(element in Object.keys(pokemonTeams)){
      element.name = element.name+"_"      
    }
    pokemonTeams[element.name] = element
  })
  console.log(pokemonTeams)
  let keylist = Object.keys(pokemonTeams)
  keylist.forEach(team=>{
    let teamdata = pokemonTeams[team]
    $("#blank").append( renderTemplate(teamdata) );
    document.getElementById(teamdata.name).onclick = function(){
        Evaluate(teamdata.name)
    }
  })
  response({status:200})
});

function Evaluate(team){
  console.log(team)
  $('#result').replaceWith('<div class="loadingio-spinner-ripple-70r72ko75lc"><div class="ldio-ldqqvjo9wyo"><div></div><div></div></div></div>')
}

function renderTemplate(teamdata){
  let tempstart =  '<div class="card" id="TEAM_ID"><h3 class="title">TEAM_NAME</h3><div class="bar"><div class="emptybar"></div><div class="filledbar"></div></div><div class="circle">'
  let tempend = '</div></div>'
  tempstart = tempstart.replace('TEAM_NAME',teamdata.name.toUpperCase())
  tempstart = tempstart.replace('TEAM_ID',teamdata.name)
  teamdata.team.forEach(element => {
      let pokeitem = 'POKENAME</span></div>'
      pokeitem = pokeitem.replace('POKENAME',element.species)
      let imagelink = 'https://play.pokemonshowdown.com/sprites/gen5/'+element.species+'.png'
      let imagespan = '<div class="item"><image class="picon" src="IMAGE_LINK"><span>'
      imagespan = imagespan.replace('IMAGE_LINK' , imagelink)
      tempstart = tempstart + imagespan +pokeitem    
  });
  return tempstart + tempend
}