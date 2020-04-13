from __future__ import print_function
import os
import sys
import subprocess
import pymongo
import dns
from pymongo import MongoClient
from random import shuffle
client = MongoClient('mongodb', 27017 , username='root',password='example')
db = client.pokemon
teamdata = db["teamdata"]
typedata = db["typedata"]

dist = {'Attack': 246.03972442508413,
 'Defense': 241.36598498023446,
 'HP': 342.045719521976,
 'SpAtk': 225.30116179782473,
 'SpDef': 228.88873831376546,
 'Speed': 213.41393206672817}

def bestFromTeam(reqkey , filterkey , value):
  return teamdata.find({ filterkey : value }).sort([("popularity",-1 ),("Total",-1)])[0][reqkey]

def getTeamData(reqkey , filterkey , value):
  return teamdata.find_one({ filterkey : value })[reqkey]

def getTypeData( filterkey , value):
  return typedata.find_one({ filterkey : value })

saved_statdistribution = {}

def getStats(name , stat):
  if name in saved_statdistribution:
    return saved_statdistribution[name][stat]
  res = teamdata.find_one({ "name" : name })
  saved_statdistribution[name] = {
        "HP": (res["HP_max"]+res["HP_min"])/2 ,
        "Attack" : (res["Attack_max+"]+res["Attack_min-"])/2 ,
        "Defense" :(res["Defense_max+"]+res["Defense_min-"])/2 ,
        "SpDef" :(res["Sp_Def_max+"]+res["Sp_Def_min-"])/2 ,
        "SpAtk" :(res["Sp_Atk_max+"]+res["Sp_Atk_min-"])/2 ,
        "Speed" :(res["Speed_max+"]+res["Speed_min-"])/2,
  }
  return saved_statdistribution[name][stat]

def checkNone(x):
  if str(x) == "None":
    return True
  return False


def weakness(team):
  weakness = []
  for member in team:
    try:
      type1 = getTeamData("type1" , "name" , member)
      type2 = getTeamData("type2" , "name" , member)
      weakto = getTypeData("type" , type1)["Weak to:"]
      if not checkNone(weakto):
        weakness = weakness + weakto.split()
      weakag = getTypeData("type" , type1)["Weak against:"]
      if not checkNone(weakag):
        weakness = weakness + weakag.split()
      noeff = getTypeData("type" , type1)["No effect against:"]
      if not checkNone(noeff):
        weakness = weakness + noeff.split()
      if not checkNone(type2):
        weakto = getTypeData("type" , type2)["Weak to:"]
        if not checkNone(weakto):
          weakness = weakness + weakto.split()
        weakag = getTypeData("type" , type2)["Weak against:"]
        if not checkNone(weakag):
          weakness = weakness + weakag.split()
        noeff = getTypeData("type" , type2)["No effect against:"]
        if not checkNone(noeff):
          weakness = weakness + noeff.split()    
    except:
      print(member)
  return weakness

def strength(team):
  strength = []
  for member in team:
    try:
      type1 = getTeamData("type1" , "name" , member)
      type2 = getTeamData("type2" , "name" , member)
      strong = getTypeData("type" , type1)["Immune to:"]
      if not checkNone(strong):
        strength = strength + strong.split()
      strong = getTypeData("type" , type1)["Resists:"]
      if not checkNone(strong):
        strength = strength + strong.split()
      if not checkNone(type2):
        strong = getTypeData("type" , type2)["Immune to:"]
        if not checkNone(strong):
          strength = strength + strong.split()
        strong = getTypeData("type" , type2)["Resists:"]
        if not checkNone(strong):
          strength = strength + strong.split()   
    except:
      print(member)  
  return strength

def statdistribution(x):
  stat = { 
            "HP":[],
            "Attack" :[],
            "Defense" :[],
            "SpDef" :[],
            "SpAtk" :[],
            "Speed" :[],
          }
  for member in x:
    try:
      stat["Attack"].append(getStats(member , "Attack"))
      stat["SpDef"].append(getStats(member , "SpDef"))
      stat["SpAtk"].append(getStats(member , "SpAtk"))
      stat["Defense"].append(getStats(member , "Defense")) 
      stat["Speed"].append(getStats(member , "Speed") )
      stat["HP"].append(getStats(member , "HP"))
    except:
      print(member)
  return stat

def get_types(c):
  try:
    typesearch = []
    type1 = getTeamData("type1" , "name" , c) 
    type2 = getTeamData("type1" , "name" , c) 
    typesearch.append(type1)
    if not checkNone(type2):
      typesearch.append(type2)
    return typesearch
  except:
    print(c)
    return []

def getbestfromtype(t):
  temp = [bestFromTeam("name" , "type1" , t)] 
  temp.append(bestFromTeam("name" , "type2" , t))
  return temp

def getbestfromstat(stat):
  template = {
    "HP":'hp',
    "Attack" : 'attack',
    "Defense" :'defense',
    "SpDef" :'sp_def',
    "SpAtk" :'sp_atk',
    "Speed" :'speed'
  }
  stat = template[stat]
  temp = [bestFromTeam("name" , "stat1" , stat)]
  temp.append(bestFromTeam("name" , "stat2" , stat))
  return temp

def getcountertype(t):
  tp = []
  resist = getTypeData("type" , t)["Resists:"] 
  immune = getTypeData("type" , t)["Immune to:"] 
  strong = getTypeData("type" , t)["Strong against:"] 
  if not checkNone(strong):
    tp = tp + strong.split()
  if not checkNone(resist):
    tp = tp + resist.split()
  if not checkNone(immune):
    tp = tp + immune.split()
  return tp
  
def best_score(analysis):
  max = -10000
  maxkey = 0
  for key in analysis:
    if analysis[key]["score"] > max:
      max = analysis[key]["score"]
      maxkey = key
  return key

def team_score(analysis , stats , weakness):
  score = 0
  for key in stats:
    score = score + sum(analysis["stats"][key]) - sum(stats[key])
  score = score + (analysis["weakness"] - len(weakness))*50
  return score

def replace_member(poke,weak,weakstat):
  typesearch = []
  typesearch = typesearch + get_types(poke)
  for t in weak:
    typesearch = typesearch + list(getcountertype(t))
  cand = []
  for t in typesearch:
    cand = cand + (getbestfromtype(t))
  for t in weakstat:
    cand = cand + (getbestfromstat(t))
  return cand

def get_alteration(team):
  weak = [w for w in weakness(team) if w not in strength(team)]
  stats = statdistribution(team)
  weakstat = []
  for area in stats:
    if sum(stats[area]) < (dist[area]*6):
      weakstat.append(area) 
  analysis = { 0 : {
      "team" : team,
      "stats" : stats,
      "weakness" : len(weak)
  }}
  for poke in team:
    try:
      remain = [x for x in team if x != poke]
      new_poke = replace_member(poke,weak,weakstat)
      new_poke = [y for y in new_poke if y not in team]
      new_poke = list(set(new_poke))
      shuffle(new_poke)
      for x in new_poke[:5]:
        new_team = remain+[x]  
        analysis[poke+x] = {
            "with" : x,
            "team" : new_team,
            "stats" : statdistribution(new_team),
            "weakness" : len([w for w in weakness(new_team) if w not in strength(new_team)])
        }
    except:
      pass    
  for key in analysis:
    analysis[key]["score"] = team_score(analysis[key] , stats , weak)
  best = best_score(analysis)
  if best == 0:
    return {
        "replace" : "none",
        "with" : "none" 
    }
  else:
    return {
        "replace" : best[:-len(analysis[best]["with"])],
        "with" : analysis[best]["with"],
      "image1" : getTeamData( "image" , "name" , best[:-len(analysis[best]["with"])]),
      "image2" : getTeamData( "image" , "name" , analysis[best]["with"]),
      "prefer_ability" : getTeamData( "prefer_ability" , "name" , analysis[best]["with"]) , 
      "prefer_item" : getTeamData( "prefer_item" , "name" , analysis[best]["with"]),
      "prefer_moves" : getTeamData( "prefer_moves" , "name" , analysis[best]["with"])
        
    }

def partner_suggestion(team):
  cand = []
  final = []
  teamtype_coverage = [] 
  for member in team:
    cand1 = getTeamData("partner1" , "name"  , member)
    cand2 = getTeamData("partner2" , "name"  , member)
    cand3 = getTeamData("partner3" , "name"  , member)
    if not checkNone(cand1):
      cand = cand + [cand1,cand2,cand3]
  for c in cand:
    flag = True
    for t in get_types(c):
      if t in teamtype_coverage:
        flag = False
    if flag:
      final.append(c)
  max = 0
  maxpoke = ""
  for c in final:
    total = getTeamData("Total" , "name"  , member)
    if total > max:
      max = total
      maxpoke = c
  return {
      "return" : "None",
      "with": maxpoke,
      "image2" : getTeamData( "image" , "name" , maxpoke),
      "prefer_ability" : getTeamData( "prefer_ability" , "name" , maxpoke) , 
      "prefer_item" : getTeamData( "prefer_item" , "name" , maxpoke ),
      "prefer_moves" : getTeamData( "prefer_moves" , "name" , maxpoke )
  }

def foundation():
  lis = [x["name"] for x in teamdata.find().sort([("popularity",-1 ),("Total",-1)])[:10] ]
  shuffle(lis)
  return {
      "return" : "None",
      "with": lis[0],
      "image2" : getTeamData( "image" , "name" , lis[0]),
      "prefer_ability" : getTeamData( "prefer_ability" , "name" , lis[0]) , 
      "prefer_item" : getTeamData( "prefer_item" , "name" , lis[0]),
      "prefer_moves" : getTeamData( "prefer_moves" , "name" , lis[0])
          }

def get_suggestion(team):
  if len(team) == 6:
    return get_alteration(team)
  elif len(team) > 0:
    return partner_suggestion(team)
  else:
    return foundation()

def lambda_handler(event, context):
    context.log(event["team"])
    return get_suggestion(event["team"])
    