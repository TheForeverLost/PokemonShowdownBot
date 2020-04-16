cd src
read -p "Enter mongodb password" PASSWORD
grep -rl "clientname, port , username=username,password=password" app/microservice/main.py \
    | xargs sed -i 's;clientname, port , username=username,password=password;"mongodb+srv://AlanJohn:'$PASSWORD'@cluster0-7tf44.mongodb.net/test?retryWrites=true\&w=majority";g' && \
    zip -9yr lambda.zip bson dns gridfs pymongo app/microservice/main.py  
aws lambda update-function-code --function-name pokemonTeamAssistant --zip-file fileb://lambda.zip
grep -rl '"mongodb+srv://AlanJohn:'$PASSWORD'@cluster0-7tf44.mongodb.net/test?retryWrites=true\&w=majority"' app/microservice/main.py \
    | xargs sed -i 's;"mongodb+srv://AlanJohn:'$PASSWORD'@cluster0-7tf44.mongodb.net/test?retryWrites=true\&w=majority";clientname, port , username=username,password=password;g' 
