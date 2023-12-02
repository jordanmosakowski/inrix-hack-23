from flask import Flask, render_template, jsonify, request
from inrix import get_route, get_parking
from flight import search_flights
from flask_cors import CORS
from transit import get_transit_info

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Hello World!"

@app.route('/route', methods=['GET'])
def api_route():
    start = request.args.get('start')
    end = request.args.get('end')
    time = request.args.get('time')
    return get_route(start, end, time)

@app.route('/parking', methods=['GET'])
def api_parking():
    point = request.args.get('point')
    radius = request.args.get('radius')
    duration = request.args.get('duration')
    return get_parking(point, radius, duration)

@app.route('/flights', methods=['GET'])
def api_flights():
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    departure_date = request.args.get('departure_date')
    return_date = request.args.get('return_date')
    return search_flights(origin, destination, departure_date, return_date)

@app.route('/transit', methods=['GET'])
def api_transit():
    start = request.args.get('start')
    end = request.args.get('end')
    time = request.args.get('time')
    return get_transit_info(start, end, time)

if __name__ == '__main__':
    app.run(debug=False, port=5000)