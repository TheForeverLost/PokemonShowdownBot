import mongoread
from flask import Flask
from flask import request
import json
app = Flask(__name__)


@app.route('/', methods=["GET","POST"])
def getfile():
    my_json = request.data.decode('utf8').replace("'", '"')
    data = json.loads(my_json)
    s = json.dumps(data, indent=4, sort_keys=True)
    return mongoread.handler(s , None)
if __name__ == '__main__':
    app.run()
