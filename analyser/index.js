const battlemoves = require("./battlemoves").BattleMovedex
const smogon = require("@smogon/calc")
const gen8ou = require('@pokemon-showdown/sets').forFormat("gen8ou")
const Pokemon = smogon.Pokemon
const Move = smogon.Move

//console.log(result)

const Pokedex = smogon.SPECIES
const Movset = smogon.MOVES
const Items = smogon.ITEMS

class BattleSituation{
    
    constructor(){
        this.team1 = []
        this.team2 = []
        this.user = null
        this.enemy = null
        this.field = smogon.Field()
        
    }

    addToTeam1(pokemon,options) {
        if(this.team1.length < 6){
            this.team1.push(new Pokemon(8,pokemon,options))
        }
    }
    addToTeam2(pokemon,options) {
        if(this.team2.length < 6){
            this.team2.push(new Pokemon(8,pokemon,options))
        }
    }
    
    adjust(field){
        this.field = field
    }
    
    chooseTeam1(pokemon){
        this.team1.forEach((element)=>{
            if (element.name == pokemon){
                console.log("I chose you , ",pokemon)
                this.user = element
                return
            }
        })
    }

    chooseTeam2(pokemon){
        this.team2.forEach((element)=>{
            if (element.name == pokemon){
                this.enemy = element
                console.log("I chose you , ",pokemon)
                return
            }
        })
    }

    getBestMove(){
        let moves = []
        gen8ou.then((setdata)=>{
            if(this.user.name in Object.keys(setdata["smogon.com/dex"])){
                moves = setdata["smogon.com/dex"][this.user.name][Object.keys(setdata["smogon.com/dex"][this.user.name])[0]]["moves"]
            }else{
                moves = setdata["smogon.com/stats"][this.user.name][Object.keys(setdata["smogon.com/stats"][this.user.name])[0]]["moves"]
            }
            let damages = {}
            moves.forEach((element)=>{
                console.log(element,this.average(smogon.calculate(8,this.user,this.enemy,new Move(8,element)).damage))
            })
            return "success"
        }).catch((err)=>{
            console.log(err)
        })
        
    }

    average(damages){
        let sum = 0
        damages.forEach(element => {
            sum += element
        });
        return sum/damages.length
    }
}

bs = new BattleSituation()
bs.addToTeam1('Gengar', {
    item: 'Choice Specs',
    boosts: {spa: 3},
  })

bs.addToTeam2('Clefable', {
    item: 'Leftovers',
    boosts: {spd: 5,def : 5},
})

bs.chooseTeam1("Gengar")
bs.chooseTeam2("Clefable")
bs.getBestMove()