/*
    To parse the stored teams
    gen8ou]Untitled 2|Bisharp|||defiant||||||||
    
*/

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


let res = getTeam("gen8ou]beta|Rotom|rotomheat|heavydutyboots|levitate|nastyplot,overheat,voltswitch,toxic|Timid|248,,,8,,252||,0,,,,|S||]Toxapex||blacksludge|regenerator|scald,recover,hex,banefulbunker|Bold|252,,252,4,,||,0,,,,|||]Clefable||leftovers|magicguard|cosmicpower,softboiled,psychup,storedpower|Bold|252,,252,4,,||,0,,,,|||]Dracovish||choiceband|strongjaw|fishiousrend,crunch,psychicfangs,outrage|Adamant|4,252,,,,252|||||]Pelipper||damprock|drizzle|defog,roost,uturn,tailwind|Bold|248,,252,8,,|||||]Obstagoon||flameorb|guts|facade,knockoff,closecombat,bulkup|Jolly|,252,4,,,252|M||||")
let res2 = getTeam("gen8ou]Untitled 2|Bisharp|||defiant||||||||")

console.log(res,res2)