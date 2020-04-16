
import app.microservice.main as src
from app import app
from flask_cors import CORS, cross_origin
from flask import request

CORS(app, support_credentials=True)

@app.route('/',methods=["GET"])
@cross_origin(supports_credentials=True)
def home():
   try:
      event = request.args
      print(event)
      event = event["team"].split("_")
      return src.lambda_handler(event,None)
   except:
      return src.lambda_handler([],None)
