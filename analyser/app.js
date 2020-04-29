const battlemoves = require("./battlemoves").BattleMovedex
const smogon = require("@smogon/calc")
const gen8ou = require('@pokemon-showdown/sets').forGen(8)
const Pokemon = smogon.Pokemon
const Move = smogon.Move
const Field = smogon.Field
const fs = require('fs')
//console.log(result)
let factors = new Set()
Object.keys(battlemoves).forEach(elem=>{
    Object.keys(battlemoves[elem]).forEach(element=>{
        factors.add(element)
    })
})

function UnderstandFactor(key){
    Object.keys(battlemoves).forEach(elem=>{
        if(battlemoves[elem][key]){
            console.log(elem)
            console.log(battlemoves[elem]["desc"])
            console.log(battlemoves[elem][key])
        }
    })
}

// console.log(UnderstandFactor('terrain'))
// console.log(battlemoves['toxic'])

class Situation{
    constructor(){
        this.team = []
        this.userTeam = []
        this.oppoTeam = []
        this.userCurr = null
        this.oppoCurr = null
        this.options = []
        this.field = new Field()
    }
    
    OnCall(){
        this.team.push(1)
        console.log(this.team)
    }

    applyMoveConditions(){

    }

    getField(fieldset){
        fieldset = fieldset.split('\n')
        let weathers = ['Sand'
            , 'Sun'
            , 'Rain'
            , 'Hail'
            , 'Harsh Sunshine'
            , 'Heavy Rain'
            , 'Strong Winds'
        ]
        let terrains = [
            'Electric' , 'Grassy' , 'Psychic' , 'Misty'
        ]
        fieldset.forEach(element=>{
            weathers.forEach(weather=>{
                if(element.indexOf(weather) >= 0){
                    this.field.weather = weather
                }
            })
            terrains.forEach(terrain=>{
                if(element.indexOf(terrain) >= 0){
                    this.field.terrain = terrain
                }
            })
        })
    }

    readMove(movestring){
        let re = /(\w+(.?\w*)+)\n/g
        let result = movestring.matchAll(re)
        for(let match of result){
            return {move : battlemoves[match[1].toLowerCase().replace(/\W/g , '')] ,  calc :  new Move(8 , match[1])}
        }
    }

    parsePokemon(pokestring){
        let pokename ,Hp=0, options = {
 
        }
        let namere = /^(\w+(-?\w*)+)/g
        let lvlre = /L(\d+)/g
        let abilityre = /Ability: (\w+(.?\w*)+)/g
        let itemre = /Item: (\w+(.?\w*)+)/g
        let result = pokestring.matchAll(namere)
        for (let match of result){
            pokename = match[1]
        }
        result = pokestring.matchAll(lvlre)
        for (let match of result){
            options["level"] = Number(match[1])
        }
        result = pokestring.matchAll(abilityre)
        for (let match of result){
            options["ability"] = match[1] 
        }
        result = pokestring.matchAll(itemre)
        for (let match of result){
            if(match[1] != 'None'){
                options["item"] = match[1]
            }
        }
        result = pokestring.matchAll(/HP: (\d+\.?\d*)\%./g)
        for (let match of result){
            Hp = Number(match[1])
        }
        options['curHP'] = Hp/100 * (new Pokemon(8,pokename,options)).stats.hp
        return {
            name : pokename,
            options : options
        }
    }

    generatePokemon(pokestring){
        let p = this.parsePokemon(pokestring)
        console.log(p)
        console.log(new Pokemon(8,p.name,p.options).curHP)
    }

    

    read(situation){
        this.getField(situation['weather'])
        situation['userMoves'].forEach(element=>{
            this.options.push({
                action : this.readMove(element),
                type : 'move'
            })
        })
        situation['userTeam'].forEach(element=>{
            this.userTeam.push(this.generatePokemon(element))
        })
        situation['oppoTeam'].forEach(element=>{
            this.oppoTeam.push(this.generatePokemon(element))
        })
        
    }
}

let situ = new Situation()

let data = fs.readFileSync('situations.json')
data = JSON.parse(data)
situ.read(data['situations'][8])