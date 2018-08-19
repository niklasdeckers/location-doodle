
import requests
from requests import Session, Request

from typing import List

import json
import datetime
import urllib
import os
import hashlib

import pandas as pd
import numpy as np


def datetime_from_isotime(dt_str):
    dt, _, us= dt_str.partition(".")
    dt= datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S")
    return dt

def timedelta_from_string(timedelta_str):
    pass

    
def location_weight_function():
    pass

class HereApi:

    def __init__(self, api_url, app_id, app_code):
        self.api_url = api_url
        self.app_id = app_id
        self.app_code = app_code
        self.session = Session()
        self.cache_dir = "cache"
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)

    def get_cache_file_name(self, url):
        cache_str = hashlib.sha224(str.encode(url)).hexdigest()
        return os.path.join(self.cache_dir, cache_str+".json")

    def do(self, action, parameters):
        p = parameters
        p["app_id"] = self.app_id
        p["app_code"] = self.app_code
        url = self.api_url % action

        request = Request('GET', url, params=p).prepare()
        cached_request_file = self.get_cache_file_name(request.url)
        print(request.url)
        print(cached_request_file)

        if os.path.exists(cached_request_file):
            print("from cache")
            with open(cached_request_file) as cache:
                return json.load(cache)
        else:
            print("from api")
            response = self.session.send(request)
            print(response.status_code)
            with open(cached_request_file, "w") as cache:
                cache.write(response.text)
            return json.loads(response.text)

def get_travel_times(starting_location, arrival_time, max_travel_time, time_resolution=5):
    df = []
    for travel_time in range(max_travel_time, time_resolution, 1-time_resolution):
        departure_time = (datetime_from_isotime(arrival_time) - datetime.timedelta(minutes=travel_time)).isoformat()
        
        app_id = os.getenv("APPID")
        app_code = os.getenv("APPCODE")

        
        trainsitApi = HereApi("https://transit.api.here.com/v3/%s.json", app_id, app_code)

        response = trainsitApi.do("isochrone", {
            "time":departure_time,
            "center":starting_location,
            "maxDur":travel_time,
            "timespan":10})
        
        '''format isodests''' 
        isodests = []
        for isoDest in response['Res']['Isochrone']['IsoDest']:
            for station in isoDest['Stn']:
                canonical_isoDest = station
                canonical_isoDest['duration'] = travel_time
                canonical_isoDest['departure_time'] = pd.to_datetime(response['Res']['Isochrone']['time'])
                canonical_isoDest['starting_location'] = starting_location
                isodests.extend([canonical_isoDest])
        isodests = pd.DataFrame.from_records(isodests)
        df.extend([isodests])
        
    df = pd.concat(df)
    df.reset_index(drop=True, inplace=True)
    reversed_isochrones = df.loc[df.groupby(['name','x','y'])["departure_time"].idxmax()]
    reversed_isochrones['travel_time'] = pd.to_datetime(meeting_start_time) - reversed_isochrones['departure_time']
    reversed_isochrones['duration']

    return reversed_isochrones


def get_optimal_locations(travel_times, n=10, alpha=0.5):
 
    travel_times_nxy = travel_times.groupby(['name','x','y'])["starting_location"].count() == len(travel_times["starting_location"].unique())
    accessible_by_all = travel_times.join(travel_times_nxy, on = ['name','x','y'], rsuffix='_all', how='outer')
    accessible_by_all = accessible_by_all.loc[accessible_by_all['starting_location_all']==True]
    accessible_by_all['travel_time'] = accessible_by_all['travel_time'].astype(np.int64).astype(float)
    
    alpha = 0.5
    
    grouped_destinations = accessible_by_all.groupby(['name','x','y'])
    weighted_destinations = pd.DataFrame(
            alpha*grouped_destinations['travel_time'].sum()
            + (1-alpha)*grouped_destinations['travel_time'].var()).sort_values(by="travel_time")
    return weighted_destinations.head(n)


'''
@return list of optimal meeting points as "long,lat"
'''
def optimal_meeting_points(arrival_time: str, starting_locations: List[str]) -> List[str]:
    
    time_resolution = 5
    max_travel_time = 45
    
    travel_times = pd.concat([get_travel_times(l, arrival_time, max_travel_time, time_resolution ) for l in starting_locations])
    locations = get_optimal_locations(travel_times, n=10, alpha=0.5).reset_index()
    
    return [str(x)+','+str(y) for x,y in zip(locations['x'], locations['y'])]
    

if __name__ == "__main__":

    
    locations = [
        "52.481761,13.356543", # euref campus
        "52.512975,13.476236", # lichtenberg
        "52.489209,13.306696", # wilmersdorf
        "52.536055,13.26612" # charlottenburg
    ]
    meeting_start_time = "2018-08-19T17:00:00"

    print(optimal_meeting_points(meeting_start_time, locations))
    
    
    
    
    
    
    

    
    


    



    


