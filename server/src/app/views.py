
import app.microservice.main as src
from app import app
from flask_cors import CORS, cross_origin
from flask import request
@app.route('/',methods=["POST"])
def home():
   event = request.get_json()
   return src.lambda_handler(event,None)

