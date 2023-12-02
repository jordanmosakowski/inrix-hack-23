from flask import Flask, render_template, jsonify, request
from inrix import get_route
from flask_cors import CORS

# Create the Flask app with the template folder specified that will contain your index.html and static folder which will contain your JavaScript files
app = Flask(__name__)
# By adding CORS(app), you are telling Flask to include CORS headers in responses. The flask_cors extension will add headers such as Access-Control-Allow-Origin: *, allowing requests from any origin.
# This way, when your frontend makes requests to your Flask server, the server will respond with the appropriate CORS headers, and the browser will permit the requests. Since the frontend and backend are on the same origin (domain), you won't encounter CORS issues.
# For more info on CORS goto: https://www.bannerbear.com/blog/what-is-a-cors-error-and-how-to-fix-it-3-ways/
CORS(app)

# This is the route that will serve your index.html template
@app.route('/')
def index():
    return "Hello World!"

# This is the route that will help you get the token and return it as a JSON response
@app.route('/route', methods=['GET'])
def api_route():
    start = request.args.get('start')
    end = request.args.get('end')
    time = request.args.get('time')
    # This makes the call to the get_token function in the auth_utils.py file
    return get_route(start, end, time)
def api_parking():
    point = request.args.get('point')
    radius = request.args.get('end')
    duration = request.args.get('time')

if __name__ == '__main__':
    app.run(debug=False, port=5000)