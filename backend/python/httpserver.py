import http.server
import json
from urllib.parse import urlparse, parse_qs

from logic import optimal_meeting_points

class CustomHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):

        get = parse_qs(urlparse(self.path).query)

        result=optimal_meeting_points(get["arrival_time"][0],json.loads(get["starting_locations"][0]))

        DUMMY_RESPONSE=json.dumps(result)

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Content-length", len(DUMMY_RESPONSE))
        self.end_headers()
        self.wfile.write(str.encode(DUMMY_RESPONSE))


def run(port, server_class=http.server.HTTPServer, handler_class=CustomHandler):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

