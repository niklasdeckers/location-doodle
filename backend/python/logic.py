import grequests
import json
import itertools
import dateutil
import datetime

def get_multiple_async(urls,max_requests=32):
    out=[]
    for i in range(0,len(urls),max_requests):
        out+=grequests.map(grequests.get(urls[j]) for j in range(i,min(i+max_requests,len(urls))))
    return out

def generate_single_api_url(start_time, max_time, starting_location):
    url="https://transit.api.here.com/v3/isochrone.json"
    url+="?app_id=inyah45axuPunUzafruc"
    url+="&app_code=dSeR84rhEUZEwBEV1NVGaA"
    url+="&time="+start_time.isoformat()
    url+="&center="+starting_location
    url+="&maxChange=6"
    url+="&maxDur="+max_time#todo is this useful? could also just take everything
    url+="&timespan=1000"#TODO is this useful?
    return url

def decode_single_api_response(response):
    return json.loads(response)

def bundles_to_json_responses(bundles):
    responses = get_multiple_async([generate_single_api_url(**bundle) for bundle in bundles])
    return (decode_single_api_response(each) for each in responses)

def generate_bundle_set(arrival_time, starting_location, steps_iter=range(0,90,10)):
    return ({"start_time":arrival_time-datetime.timedelta(minutes=step),"max_time":step,"starting_location":starting_location} for step in steps_iter)

def bundle_iterator(responses,lens):
    pos=0
    for each in lens:
        yield responses[pos:pos+each]
        pos+=each

def join_split_bundle_sets(bundle_sets):
    lens=(len(bundle_set) for bundle_set in bundle_sets)
    bundles=itertools.chain.from_iterable(bundle_sets)
    responses=bundles_to_json_responses(bundles)
    return bundle_iterator(responses,lens)

def process_single_bundle_set_results(results):
    print(json.dumps(results[0]))
    #TODO

def optimal_meeting_points(arrival_time, starting_locations):
    arrival_time= dateutil.parser.parse(arrival_time)
    res=join_split_bundle_sets(generate_bundle_set(arrival_time,starting_location) for starting_location in starting_locations)
    for each in res:
        process_single_bundle_set_results(each)