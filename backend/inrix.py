import requests
import os

from dotenv import load_dotenv
load_dotenv()

HASH_TOKEN = os.getenv('INRIX_HASH_TOKEN')
APP_ID = os.getenv('INRIX_APP_ID')
TOKEN_URL = 'https://api.iq.inrix.com/auth/v1/appToken'

def get_token():
    #Pass in the app_id and hash_token as query parameters
    params = {
        'appId': APP_ID,
        'hashToken': HASH_TOKEN
    }
    # Make the request to the INRIX token endpoint
    try:
        response = requests.get(TOKEN_URL, params=params)
        response.raise_for_status()  # Raise HTTPError for bad responses

        data = response.json()
        # Extract the token from the response
        # For more info on how to parse the response, see the json_parser_example.py file
        token = data['result']['token']
        return token

    except requests.exceptions.RequestException as e:
        return f'Request failed with error: {e}', None
    except (KeyError, ValueError) as e:
        return f'Error parsing JSON: {e}', None

def get_route(start, end, time):
    url = "https://api.iq.inrix.com/findRoute?wp_1="+ start +"&wp_2=" + end + "&routeOutputFields=p&format=json&arrivalTime=" + time

    payload = {}
    headers = {
    'Authorization': 'Bearer '+get_token()
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.text

def get_parking(point, radius, duration):
    url = "https://api.iq.inrix.com/lots/v3?point="+ point +"&radius=" + radius + "&duration" + duration
    
    payload = {}
    headers = {
    'Authorization': 'Bearer '+get_token()
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.text