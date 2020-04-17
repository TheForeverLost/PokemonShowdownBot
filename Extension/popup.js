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
  
  document.body.style.width = "400px"
  document.body.style.height = "600px"
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
        Evaluate(teamdata)
    }
  })
  response({status:200})
});

function Evaluate(data){
  console.log(data)
  $('#result').replaceWith('<div id="result" class="loadingio-spinner-pulse-6wgmhr0kpgk"><div class="ldio-ckct7hxv908"><div></div><div></div><div></div></div></div>')
  if(data["team"].length == 0){
    param = {}
  }else{
    tag = data["team"][0]["species"]
    for(let i = 1 ; i < data["team"].length ; i++ ){
      tag  = tag + "_" + data["team"][i]["species"]
    }
    param={
      team : tag
    }
    console.log(param)
  }
  $.get('http://localhost:9000',param, function(resultdata){
      $('#result').replaceWith( renderResult(resultdata) )
  })
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

function renderResult(res){
  let elemheader = '<div id="result" class="rcard"><image class="picon_large" src="POKEIMAGE"><div class="rcard_body">'
  let elemspec = '<p>SITUATION <strong>POKEMON</strong> <strong>ABILITY</strong></p>'
  let elemitem = '<p>suggested item : <strong>ITEM</strong></p>'
  let elemmoves = '<p>suggested moves : <strong>MOVES</strong></p>'
  let elemend = '</div></div>'
  elemheader = elemheader.replace('POKEIMAGE',res.image2)
  if(res.replace != "None"){
    elemspec = elemspec.replace('SITUATION',res.replace +' ⇁')
  }else{
    elemspec = elemspec.replace('SITUATION','add')
  }
  elemspec = elemspec.replace('POKEMON',res.with.toUpperCase())
  if (res.prefer_ability != "None") {
    elemspec = elemspec.replace('ABILITY','('+res.prefer_ability+')')
  } else {
    elemspec = elemspec.replace('ABILITY','')
  }
  if (res.prefer_item != "None") {
    elemitem = elemitem.replace('ITEM',res.prefer_item)
  } else {
    elemitem = ''
  }
  let moves = ''
  res.prefer_moves.forEach(element=>{
    moves = moves + element + ','
  })
  moves = moves.slice(0,-1)
  elemmoves = elemmoves.replace('MOVES',moves)
  return elemheader + elemspec + elemitem + elemmoves + elemend
}
