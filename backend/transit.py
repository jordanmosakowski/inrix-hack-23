import os
import requests
from dotenv import load_dotenv
load_dotenv()
TRANSIT_API_KEY = os.getenv('TRANSIT_API_KEY')

def get_transit_info(start, end, time, isArrival):
    url = "https://transit.hereapi.com/v8/routes?apiKey="+ TRANSIT_API_KEY + "&origin="+ start +"&destination="+ end +"&return=fares&" + ("arrivalTime=" + time if isArrival == 'true' else "departureTime=" + time)
    response = requests.request("GET", url)
    return response.text