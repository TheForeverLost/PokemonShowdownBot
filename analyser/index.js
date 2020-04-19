const battlemoves = require("./battlemoves").BattleMovedex
const smogon = require("@smogon/calc")
const gen8ou = require('@pokemon-showdown/sets').forGen(8)
const Pokemon = smogon.Pokemon
const Move = smogon.Move

//console.log(result)

const Pokedex = smogon.SPECIES
const Movset = smogon.MOVES
const Items = smogon.ITEMS
let setdex = {}

let field
let data = []
let userteam = []
let enemyteam = []
function calculateMovesOfAttacker(gen, attacker, defender, field) {
	var results = [];
	for (var i = 0; i < 4; i++) {
        results[i] = smogon.calculate(gen, attacker, defender, attacker.moves[i],field);
	}
	return results;
}

function getSetOptions(){
    let setOptions = []
    pokenames = Object.keys(setdex)
    pokenames.forEach(pokemon => {
        setnames = Object.keys(setdex[pokemon])
        setnames.forEach(element=>{
            try{
                setOptions.push(createPokemon({
                    species : pokemon ,
                    ability : setdex[pokemon][element].ability ,
                    item : setdex[pokemon][element].item ,
                    moves : setdex[pokemon][element].moves ,
                    nature : setdex[pokemon][element].nature ,
                    evs : setdex[pokemon][element].evs
                }))
            }catch(error){
                setOptions.push(createPokemon({
                    species : pokemon+'-Shield' ,
                    ability : setdex[pokemon][element].ability ,
                    item : setdex[pokemon][element].item ,
                    moves : setdex[pokemon][element].moves ,
                    nature : setdex[pokemon][element].nature ,
                    evs : setdex[pokemon][element].evs
                }))
                setOptions.push(createPokemon({
                    species : pokemon+'-Blade' ,
                    ability : setdex[pokemon][element].ability ,
                    item : setdex[pokemon][element].item ,
                    moves : setdex[pokemon][element].moves ,
                    nature : setdex[pokemon][element].nature ,
                    evs : setdex[pokemon][element].evs
                }))
            }
        })
    })
    return setOptions 
}

function createPokemon(setdata){
        return new Pokemon(8 , setdata.species , {
            level : 100 ,
            ability : setdata.ability ,
            item : setdata.item ,
            moves : setdata.moves ,
            nature : setdata.nature ,
            evs : setdata.evs 
        })    
}

function generateResult(){
    var selectedTiers = ['OU'];
	var setOptions = getSetOptions();
    var dataSet = [];
    userteam.forEach(user=>{
        setOptions.forEach(oppo=>{
            if(enemyteam.includes(oppo.species.name)){
                let field = new smogon.Field( {
                    gameType : "Singles",
                    weather : autosetWeather(user.ability) != "" ? autosetWeather(user.ability) : (autosetWeather(oppo.ability) != ""  ? autosetWeather(oppo.ability) : '') 
                } )
                let damageResults = []
                
                for (var i = 0; i < 4; i++) {
                        damageResults[i] = smogon.calculate(8, user , oppo, new Move(8 , user.moves[i]),field); 
                }
                var attacker = damageResults[0].attacker;
                var defender = damageResults[0].defender;
                let highestDamage = -1;
                let data = []
                var result, minDamage, maxDamage, minPercentage, maxPercentage, minPixels, maxPixels;
                for (var n = 0; n < 4; n++) {
					result = damageResults[n];
					minDamage = result.damage[0] 
					maxDamage = result.damage[result.damage.length - 1]
					minPercentage = Math.floor(minDamage * 1000 / defender.maxHP()) / 10;
					maxPercentage = Math.floor(maxDamage * 1000 / defender.maxHP()) / 10;
					minPixels = Math.floor(minDamage * 48 / defender.maxHP());
					maxPixels = Math.floor(maxDamage * 48 / defender.maxHP());
					if (maxDamage > highestDamage) {
						highestDamage = maxDamage;
						while (data.length > 0) {
							data.pop();
						}
						data.push(result)
					}
                }
                data.forEach(res=>{
                    dataSet.push(res)
                })
            }
            
        })
    })
    return dataSet
}

function PokemonTeams(){
    userteam = []
    enemyteam = []
    alloption = getSetOptions()
    for (let index = 0; index < 6; index++) {
        userteam.push(alloption[Math.floor(Math.random() * alloption.length)])
    }
    pokenames = Object.keys(setdex) 
    for (let index = 0; index < 6; index++) {
        enemyteam.push(pokenames[Math.floor(Math.random() * pokenames.length)])
    }
}

function autosetWeather(ability) {
    newWeather = ""
    switch (ability) {
	case "Drought":
		lastAutoWeather = "Sun";
		break;
	case "Drizzle":
		lastAutoWeather = "Rain";
		break;
	case "Sand Stream":
		lastAutoWeather = "Sand";
		break;
	case "Snow Warning":
		lastAutoWeather = "Hail";
		break;
	case "Desolate Land":
		lastAutoWeather = "Harsh Sunshine";
		break;
	case "Primordial Sea":
		lastAutoWeather = "Heavy Rain";
		break;
	case "Delta Stream":
		lastAutoWeather = "Strong Winds";
		break;
	default:
		lastAutoWeather = "";
		break;
    }
    return lastAutoWeather
}

function avg(arr){
    let sum = 0
    arr.forEach(elem=>{
        sum += elem
    })
    return sum/arr.length
}


gen8ou.then((data)=>{
    Object.keys(data).forEach(format=>{
        if(format == 'gen8ou' || format == 'gen8uu' || format == 'gen8ru' || format == 'gen8nu' || format == 'gen8pu' || format == 'gen8lc' ){
            let dataform = data[format]
            Object.keys(dataform).forEach(element => {
                let databox = dataform[element]
                Object.keys(databox).forEach(pokekey=>{
                    if (Object.keys(setdex).includes(pokekey)) {
                    Object.keys(databox[pokekey]).forEach(set=>{
                        setdex[pokekey][set] = databox[pokekey][set]
                    })  
                    }else{
                        setdex[pokekey] = databox[pokekey]
                    } 
                })
            });
            }
    })
    PokemonTeams()
    console.log("\nyour team\n-------\n")
    userteam.forEach(member=>{
        console.log(member.name)
    })
    console.log("\nopponent team\n-------\n")
    enemyteam.forEach(member=>{
        console.log(member)
    })
    console.log("\n");
    
    const analysis = (generateResult())
    analysis.forEach(result=>{
        try{
            console.log(result.attacker.name , " uses " ,result.move.originalName ,' on ' ,result.defender.name , " dealing " , avg(result.damage)) ;
        }catch(error){

        }
    })
   
}).catch(error=>{
    console.log(error);  
})
