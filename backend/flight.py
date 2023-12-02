from flask import jsonify, send_file
import requests

from dotenv import load_dotenv
import os

load_dotenv()  # This loads the environment variables from .env
FLIGHT_API_KEY = os.getenv('FLIGHT_API_KEY')

def search_flights(origin, destination, departure_date, return_date):

    # return send_file('flight.json', mimetype='application/json')

    url = f"https://api.flightapi.io/roundtrip/{FLIGHT_API_KEY}/{origin}/{destination}/{departure_date}/{return_date}/1/0/0/Economy/USD"

    response = requests.get(url)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Request failed'}), response.status_code