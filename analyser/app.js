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
        this.oppoOptions = []
        this.field = new Field()
    }
    
    OnCall(){
        this.team.push(1)
        console.log(this.team)
    }

    applyMoveConditions(move){

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
        let pokename ,Hp=0, options = {}
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
        result = pokestring.matchAll(/•.(\w+(\ ?\w+)+)/g)
        options['moves'] = []
        for (let match of result){
            options.moves.push(match[1])
        }
        result = pokestring.matchAll(/HP: (\d+\.?\d*)\%./g)
        for (let match of result){
            Hp = Number(match[1])
        }
        let statusMap = {
            "PAR" :  'Paralyzed',
            "PSN" : 'Poisoned',
            "TOX" : 'Badly Poisoned' ,
            "BRN" : 'Burned',
            "SLP" : 'Asleep',
            "FRZ" : 'Frozen'
        }
        result = pokestring.matchAll(/([A-Z]{3})/g)
        for (let match of result){
            options['status'] = statusMap[match[1]]
        }
        
        options['curHP'] = Hp/100 * (new Pokemon(8,pokename,options)).stats.hp
        return {
            name : pokename,
            options : options
        }
    }

    generatePokemon(pokestring){
        let p = this.parsePokemon(pokestring)
        return new Pokemon(8,p.name,p.options)
    }

    getCurrStatus(CurrStatus){
        CurrStatus = CurrStatus.join('\n')
        let status = "Healthy"
        let statusMap = {
            "PAR" :  'Paralyzed',
            "PSN" : 'Poisoned',
            "TOX" : 'Badly Poisoned' ,
            "BRN" : 'Burned',
            "SLP" : 'Asleep',
            "FRZ" : 'Frozen'
        }
        let boosts = {}
        // const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
        const boostTable = {
            1.5 : 1,
            2 : 2,
            2.5 :3 ,
            3 :4 ,
            3.5 :5 ,
            4 :6 ,
            0.67 : -1,
            0.5 : -2,
            0.4 : -3 ,
            0.33 : -4 ,
            0.29 : -5 ,
            0.25 : -6 ,
        };
        
        let result = CurrStatus.matchAll(/([A-Z]{3})/g)
        for (const match of result) {
            status = statusMap[match[1]]
        } 
        result = CurrStatus.matchAll(/(\d\.?\d*)×.(\w{3})/g)
        for (const match of result) {
            let val = Number(match[1])
            boosts[match[2].toLowerCase()] = boostTable[val]
        }
        return {status:status,boosts:boosts}
    }

    generateCurrPokemon(pokestring,status){
        let addopt = this.getCurrStatus(status)
        let p = this.parsePokemon(pokestring)
        p.options["status"] = addopt.status
        p.options["boosts"] = addopt.boosts
        return new Pokemon(8,p.name,p.options)
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
        this.userCurr = this.generateCurrPokemon(situation['userCurr'] , situation['oppoStatus'])
        this.oppoCurr = this.generateCurrPokemon(situation['oppoCurr'] , situation['userStatus'])
        console.log(this.userCurr ,this.oppoCurr)
    }
}

let situ = new Situation()

let data = fs.readFileSync('situations.json')
data = JSON.parse(data)
situ.read(data['situations'][7])