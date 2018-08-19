import grequests
import json
import itertools
import dateutil.parser
import datetime
import collections
import urllib.request

def get_multiple_async(urls,max_requests=32):
    out=[]
    for i in range(0,len(urls),max_requests):
        out+=grequests.map(grequests.get(urls[j]) for j in range(i,min(i+max_requests,len(urls))))
    return out

def generate_single_api_url(start_time, max_time, starting_location):
    #print(starting_location)
    url="https://transit.api.here.com/v3/isochrone.json"
    url+="?app_id=inyah45axuPunUzafruc"
    url+="&app_code=dSeR84rhEUZEwBEV1NVGaA"
    url+="&time="+start_time.isoformat()
    url+="&center="+starting_location
    url+="&maxChange=6"
    url+="&maxDur="+str(max_time)#todo is this useful? could also just take everything
    url+="&timespan=1000"#TODO is this useful?
    return url

def decode_single_api_response(response):
    #print(response)
    return json.loads(response.content)

def bundles_to_json_responses(bundles):
    responses = get_multiple_async([generate_single_api_url(**bundle) for bundle in bundles])
    return [decode_single_api_response(each) for each in responses]

def generate_bundle_set(arrival_time, starting_location, steps_iter=range(5,90,5)):
    return [{"start_time":arrival_time-datetime.timedelta(minutes=step),"max_time":step,"starting_location":starting_location} for step in steps_iter]

def bundle_iterator(zipped_responses,lens):
    #input(zipped_responses)
    pos=0
    for each in lens:
        #input(str(pos)+str(pos+each))
        yield zipped_responses[pos:pos+each]
        pos+=each

def join_split_bundle_sets(bundle_sets):
    lens=[len(bundle_set) for bundle_set in bundle_sets]
    bundles=list(itertools.chain.from_iterable(bundle_sets))
    responses=bundles_to_json_responses(bundles)
    #input(responses)
    #print(responses)
    return bundle_iterator(list(zip(responses,bundles)),lens)

def process_single_bundle_set_results(results,arrival_time):
    helper_mapping={}
    total_mapping={}
    for result,bundle in results:
        current_mapping={v["Stn"][0]["id"]: (arrival_time-bundle["start_time"]).total_seconds()//60 for v in result["Res"]["Isochrone"]["IsoDest"] if bundle["start_time"]+datetime.timedelta(minutes=int(''.join(c for c in v["duration"] if c.isdigit())))<=arrival_time}
        helper_mapping.update({v["Stn"][0]["id"]: v for v in result["Res"]["Isochrone"]["IsoDest"]})
        for k,v in current_mapping.items():
            if k in total_mapping:
                total_mapping[k]=min(total_mapping[k],current_mapping[k])
            else:
                total_mapping[k]=current_mapping[k]
    return total_mapping,helper_mapping

def optimize(maps,k=3):#TODO extend
    #input(maps)
    s=sum((collections.Counter(map) for map in maps),collections.Counter())
    justice_factor=lambda k: abs(max(map[k] for map in maps)-min(map[k] for map in maps))
    return [min( list(set.intersection(*(set(map.keys()) for map in maps))), key=(lambda k: s[k]+justice_factor(k)))]


def places_api(location,topic=""):
    #print(starting_location)
    url="https://places.api.here.com/places/v1/discover/around"
    url+="?app_id=inyah45axuPunUzafruc"
    url+="&app_code=dSeR84rhEUZEwBEV1NVGaA"
    url+="&in="+location+";r=1000"#radius in meters
    if topic!="": url+="&cat="+topic
    return url

def improve_starting_location(location):
    url = "https://transit.api.here.com/v3/stations/by_geocoord.json"
    url += "?app_id=inyah45axuPunUzafruc"
    url += "&app_code=dSeR84rhEUZEwBEV1NVGaA"
    url += "&center=" + location
    url+="&radius=1000"  # radius in meters
    url+="&max=1"
    contents = urllib.request.urlopen(url).read()
    parsed=json.loads(contents)
    return parsed["Res"]["Stations"]["Stn"][0]["y"]+","+parsed["Res"]["Stations"]["Stn"][0]["0"]

def optimal_meeting_points(arrival_time, starting_locations,topic=""):

    starting_locations=[improve_starting_location(loc) for loc in starting_locations]
    arrival_time = dateutil.parser.parse(arrival_time)
    #todo #print([generate_bundle_set(arrival_time,starting_location) for starting_location in starting_locations])
    res_generator=join_split_bundle_sets([generate_bundle_set(arrival_time,starting_location) for starting_location in starting_locations])
    res=list(res_generator)
    #input(res)
    maps=[]
    helper={}
    for each in res:
        try:#if True:#try:
            #print(json.dumps(each))
            #print((each[0]))
            each[0][0]["Res"]["Isochrone"]
            single_map,helper2=process_single_bundle_set_results(each,arrival_time)
            helper.update(helper2)
            maps.append(single_map)
        except:#if False:#except:#error in api response
            pass
    if len(maps)==0:
        return #TODO dann auftraggeber-Startpunkt verwenden?
    else:

        bests=optimize(maps)#todo weighted sum

    #input(helper)

    #todo apply weight function for best picks
    return [helper[best] for best in bests]
    #contents = urllib.request.urlopen(station_search(bests)).read()
    #parsed=json.loads(contents)
    """best=bests[0]#todo bad, use api
    for v in res[0][0][0]["Res"]["Isochrone"]["IsoDest"]:
        if v["Stn"][0]["id"]==best:
            return v"""
    #return bests
