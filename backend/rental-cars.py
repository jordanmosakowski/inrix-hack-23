import requests
import json

from dotenv import load_dotenv
import os

load_dotenv()

RAPID_API_KEY=os.getenv('RAPID_API_KEY')
RAPID_API_HOST=os.getenv('RAPID_API_HOST')

# Function to call the /searchLocation endpoint
def search_location(query):
    url = "https://sky-scrapper.p.rapidapi.com/api/v1/cars/searchLocation"
    querystring = {"query": query}

    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST
    }
    response = requests.get(url, headers=headers, params=querystring)
    return response.json()

# Function to call the /searchCars endpoint
def search_cars(entity_id):
    url = "https://sky-scrapper.p.rapidapi.com/api/v1/cars/searchCars"

    querystring = {
        "pickUpEntityId": entity_id,
        "pickUpDate": "2024-01-08",
        "pickUpTime": "10:00",
        "dropOffDate": "2024-01-08",
        "dropOffTime": "11:00",
        "currency": "USD",
        "countryCode": "US",
        "market": "en-US"
    }

    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST
    }

    response = requests.get(url, headers=headers, params=querystring)
    return response.json()

def main():
    location_data = search_location("SFO")

    if 'data' in location_data and len(location_data['data']) > 0:
        entity_id = location_data['data'][0].get('entity_id')
        if entity_id:
            car_data = search_cars(entity_id)

            combined_data = {
                "LocationData": location_data,
                "CarData": car_data
            }

            with open('rental-cars.json', 'w') as file:
                json.dump(combined_data, file, indent=4)
        else:
            print("Entity ID not found in the first location data")
    else:
        print("No data found in location response")

if __name__ == "__main__":
    main()
