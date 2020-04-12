import dns
from pymongo import MongoClient
import pandas as pd
from random import shuffle
import json
client = MongoClient("mongodb+srv://AlanJohn:$Grizzly$99@cluster0-7tf44.mongodb.net/test?retryWrites=true&w=majority")
db = client.pokemon
teamdata = db["teamdata"]
typedata = db["typedata"]
df = []
for post in teamdata.find().sort([("popularity",-1 ),("Total",-1)]):
    df.append(post)

df = pd.DataFrame(df)
types = []

for post in typedata.find():
    types.append(post)

types = pd.DataFrame(types)
dist = {'Attack': 246.03972442508413,
 'Defense': 241.36598498023446,
 'HP': 342.045719521976,
 'SpAtk': 225.30116179782473,
 'SpDef': 228.88873831376546,
 'Speed': 213.41393206672817}

def weakness(team):
  weakness = []
  for member in team:
    try:
      type1 = df[df["name"] == member]["type1"].item()
      type2 = df[df["name"] == member]["type2"].item()
      weakto = types[types["type"] == type1]["Weak to:"].item()
      if not pd.isna(weakto):
        weakness = weakness + weakto.split()
      weakag = types[types["type"] == type1]["Weak against:"].item()
      if not pd.isna(weakag):
        weakness = weakness + weakag.split()
      noeff = types[types["type"] == type1]["No effect against:"].item()
      if not pd.isna(noeff):
        weakness = weakness + noeff.split()
      if not pd.isna(type2):
        weakto = types[types["type"] == type2]["Weak to:"].item()
        if not pd.isna(weakto):
          weakness = weakness + weakto.split()
        weakag = types[types["type"] == type2]["Weak against:"].item()
        if not pd.isna(weakag):
          weakness = weakness + weakag.split()
        noeff = types[types["type"] == type2]["No effect against:"].item()
        if not pd.isna(noeff):
          weakness = weakness + noeff.split()    
    except:
      print(member)
  return weakness

def strength(team):
  strength = []
  for member in team:
    try:
      type1 = df[df["name"] == member]["type1"].item()
      type2 = df[df["name"] == member]["type2"].item()
      strong = types[types["type"] == type1]["Immune to:"].item()
      if not pd.isna(strong):
        strength = strength + strong.split()
      strong = types[types["type"] == type1]["Resists:"].item()
      if not pd.isna(strong):
        strength = strength + strong.split()
      if not pd.isna(type2):
        strong = types[types["type"] == type2]["Immune to:"].item()
        if not pd.isna(strong):
          strength = strength + strong.split()
        strong = types[types["type"] == type2]["Resists:"].item()
        if not pd.isna(strong):
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
      stat["Attack"].append(( df[df["name"] == member]["Attack_max+"].item() + df[df["name"] == member]["Attack_min-"].item() )/2 )
      stat["SpDef"].append(( df[df["name"] == member]["Sp_Def_max+"].item() + df[df["name"] == member]["Sp_Def_min-"].item() )/2 )
      stat["SpAtk"].append(( df[df["name"] == member]["Sp_Atk_max+"].item() + df[df["name"] == member]["Sp_Atk_min-"].item() )/2 )
      stat["Defense"].append(( df[df["name"] == member]["Defense_max+"].item() + df[df["name"] == member]["Defense_min-"].item() )/2 ) 
      stat["Speed"].append(( df[df["name"] == member]["Speed_max+"].item() + df[df["name"] == member]["Speed_min-"].item() )/2 )
      stat["HP"].append(( df[df["name"] == member]["HP_max"].item() + df[df["name"] == member]["HP_min"].item() )/2 )
    except:
      print(member)
  return stat

def get_types(c):
  try:
    typesearch = []
    type1 = df[df["name"]==c]["type1"].item()
    type2 = df[df["name"]==c]["type2"].item()
    typesearch.append(type1)
    if not pd.isna(type2):
      typesearch.append(type2)
    return typesearch
  except:
    print(c)
    return []

def getbestfromtype(t):
  temp = [list(df[df["type1"] == t]["name"])[0]]
  temp.append(list(df[df["type2"] == t]["name"])[0])
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
  temp = [list(df[df["stat1"] == stat]["name"])[0]]
  temp.append(list(df[df["stat2"] == stat]["name"])[0])
  return temp

def getcountertype(t):
  tp = []
  resist = types[types["type"] == t]["Resists:"].item() 
  immune = types[types["type"] == t]["Immune to:"].item() 
  strong = types[types["type"] == t]["Strong against:"].item() 
  if not pd.isna(strong):
    tp = tp + strong.split()
  if not pd.isna(resist):
    tp = tp + resist.split()
  if not pd.isna(immune):
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
        "replace" : "none"  
    }
  else:
    return {
        "replace" : best[:-len(analysis[best]["with"])],
        "with" : analysis[best]["with"],
      "prefer_ability" : df[df["name"] == analysis[best]["with"]]["prefer_ability"].item(),
      "prefer_item" : df[df["name"] == analysis[best]["with"]]["prefer_item"].item(),
      "prefer_moves" : df[df["name"] == analysis[best]["with"]]["prefer_moves"].item()
        
    }

def partner_suggestion(team):
  cand = []
  final = []
  teamtype_coverage = [] 
  for member in team:
    cand1 = df[df["name"] == member]["partner1"].item()
    cand2 = df[df["name"] == member]["partner2"].item()
    cand3 = df[df["name"] == member]["partner3"].item()
    if not pd.isna(cand1):
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
    total = df[df["name"] == member]["Total"].item()
    if total > max:
      max = total
      maxpoke = c
  return {
      "return" : "None",
      "with": maxpoke,
      "prefer_ability" : df[df["name"] == maxpoke]["prefer_ability"].item(),
      "prefer_item" : df[df["name"] == maxpoke]["prefer_item"].item(),
      "prefer_moves" : df[df["name"] == maxpoke]["prefer_moves"].item()
  }

def foundation():
  lis = list(df["name"][:10])
  shuffle(lis)
  return {
      "return" : "None",
      "with": lis[0],
      "prefer_ability" : df[df["name"] == lis[0]]["prefer_ability"].item(),
      "prefer_item" : df[df["name"] == lis[0]]["prefer_item"].item(),
      "prefer_moves" : df[df["name"] == lis[0]]["prefer_moves"].item()
          }

def get_suggestion(team):
  if len(team) == 6:
    return get_alteration(team)
  elif len(team) > 0:
    return partner_suggestion(team)
  else:
    return foundation()

def handler(event,context):
  body = json.loads(event)["team"]
  return get_suggestion(body)