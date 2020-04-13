cd pythonlambda
grep -rl "clientname, port , username=username,password=password" lambda_function.py \
    | xargs sed -i 's;clientname, port , username=username,password=password;"mongodb+srv://AlanJohn:$Grizzly$99@cluster0-7tf44.mongodb.net/test?retryWrites=true\&w=majority";g' && \
    zip -9yr lambda.zip . 
aws lambda update-function-code --function-name pokemonTeamAssistant --zip-file fileb://lambda.zip
grep -rl '"mongodb+srv://AlanJohn:$Grizzly$99@cluster0-7tf44.mongodb.net/test?retryWrites=true\&w=majority"' lambda_function.py \
    | xargs sed -i 's;"mongodb+srv://AlanJohn:$Grizzly$99@cluster0-7tf44.mongodb.net/test?retryWrites=true\&w=majority";clientname, port , username=username,password=password;g' 
