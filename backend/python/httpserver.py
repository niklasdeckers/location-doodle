import http.server

class CustomHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        DUMMY_RESPONSE="Heureka"
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Content-length", len(DUMMY_RESPONSE))
        self.end_headers()
        self.wfile.write(str.encode(DUMMY_RESPONSE))


def run(server_class=http.server.HTTPServer, handler_class=CustomHandler):
    server_address = ('', 8080)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()