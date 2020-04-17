/*
    To parse the stored teams
    gen8ou]Untitled 2|Bisharp|||defiant||||||||
    
*/

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

let res = getTeam("gen8ou]beta|Rotom|rotomheat|heavydutyboots|levitate|nastyplot,overheat,voltswitch,toxic|Timid|248,,,8,,252||,0,,,,|S||254]Toxapex||blacksludge|regenerator|scald,recover,hex,banefulbunker|Bold|252,,252,4,,||,0,,,,|||]Clefable||leftovers|magicguard|cosmicpower,softboiled,psychup,storedpower|Bold|252,,252,4,,||,0,,,,|||]Dracovish||choiceband|strongjaw|fishiousrend,crunch,psychicfangs,outrage|Adamant|4,252,,,,252|||||]Pelipper||damprock|drizzle|defog,roost,uturn,tailwind|Bold|248,,252,8,,|||||]Obstagoon||flameorb|guts|facade,knockoff,closecombat,bulkup|Jolly|,252,4,,,252|M||||")
let team = getName("gen8ou]beta|Rotom|rotomheat|heavydutyboots|levitate|nastyplot,overheat,voltswitch,toxic|Timid|248,,,8,,252||,0,,,,|S||254]Toxapex||blacksludge|regenerator|scald,recover,hex,banefulbunker|Bold|252,,252,4,,||,0,,,,|||]Clefable||leftovers|magicguard|cosmicpower,softboiled,psychup,storedpower|Bold|252,,252,4,,||,0,,,,|||]Dracovish||choiceband|strongjaw|fishiousrend,crunch,psychicfangs,outrage|Adamant|4,252,,,,252|||||]Pelipper||damprock|drizzle|defog,roost,uturn,tailwind|Bold|248,,252,8,,|||||]Obstagoon||flameorb|guts|facade,knockoff,closecombat,bulkup|Jolly|,252,4,,,252|M||||")
team.team = res
console.log(team)