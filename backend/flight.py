from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

from dotenv import load_dotenv
import os

load_dotenv()  # This loads the environment variables from .env
API_KEY = os.getenv('API_KEY')

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World'

@app.route('/search-flights', methods=['GET'])
def search_flights():

    url = f"https://api.flightapi.io/roundtrip/{API_KEY}/FRA/SFO/2024-01-08/2024-01-12/1/0/0/Economy/USD"

    
    response = requests.get(url)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Request failed'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)