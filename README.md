# Pokemon Showdown Assistant

![logo](https://raw.githubusercontent.com/TheForeverLost/PokemonShowdownBot/master/dragapult.gif)

## Introduction

So I have been a huge pokemon fan for a long time and [pokemon showdown](https://play.pokemonshowdown.com/) is a platform for competitive pokemon battling by smogon which is the largest open source organization for projects dealing with the world of pokemon

![](https://raw.githubusercontent.com/TheForeverLost/PokemonShowdownBot/master/pokemonshowdown.png)



So with this project i wanted to use technologies i always wanted to try to make a browser extension that can act as a assistant in-battle and during teambuilding phase

I also plan to use web automation and AI/Ml to create a bot that will play the game as a CPU AI

## Understanding the files

**PokemonShowdownAnalysis.ipynb**

Before any sort of project it was essential to understand how the entire project works as well as the 

dynamics of the game so this notebook extracts all possible data from smogon resources such as pokemon data , move data , battle records , image resources etc

**Teambuilder Extension**

*Chrome Extension that will be used as an assistant in teambuilder*
Recommendation of possible additions to team is fast but the the evaluation of team can take time ( ~40 secs) , currently the only format supported is gen8ou but more formats can easily be added.
Recommendations and evaluations are made not only by game mechanics but also taking into consideration team data from over 1000 matches played in the past week
![gif of extension](https://raw.githubusercontent.com/TheForeverLost/PokemonShowdownBot/master/teambuilder.gif)

**Server**

This folder contains the container information as well source code for all the microservices involved as well as replica db servers to run on localhost  for development purpose 

To run the microservice at localhost along with a replica DB server :

1.  Switch into the src directory
2. Run `docker-compose up`

To build and push to aws lambda

1. configure aws cli
   `aws configure`
2.  give the deployment script permissions
   `chmod u+x ./deploy.sh`
3. run the deployment script
   `./deploy.sh` 

**Analyzer**

This consists of a node environment where analysis of the pokemon showdown game mechanics take place with the help of various smogon npm packages 

## References

1. you can check out the various projects by smogon here<br>
   [![](https://avatars2.githubusercontent.com/u/5144145?s=200&v=4)](https://github.com/smogon) 

2. For emulating the aws lambda function on my pc , I have built the a docker image for the application using the [uwsgi-nginx-flask](https://hub.docker.com/r/tiangolo/uwsgi-nginx-flask/). This allows more freedon of customization than [lambci/lamda:python3.6](https://hub.docker.com/r/lambci/lambda) docker image which is an abstraction of the aws lambda environment though the latter gives a much more similar environment to aws lambda services