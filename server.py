import BaseHTTPServer
import SimpleHTTPServer
import SocketServer

import sys
import os
import subprocess
import socket

import cgi
import json
import pprint
import tempfile
import shlex

import re
import textwrap

SOLC_PATH = os.environ.get('SOLC_PATH', '/usr/local/bin/solc')

def escape_ansi(line):
    ansi_escape = re.compile(r'(\x9B|\x1B\[)[0-?]*[ -/]*[@-~]')
    return ansi_escape.sub('', line)

class MyServer(BaseHTTPServer.HTTPServer):
    def __init__(self):
        self.port = 8000
        SocketServer.TCPServer.__init__(self,('', self.port), MyHandler)

    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        BaseHTTPServer.HTTPServer.server_bind(self)

class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        # do GETs as normal
        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

    def do_slither(self, buf):
        info = json.loads(buf)

        # we get an array so get just first element
        info = info[0]

        # get the current target
        sol_filename = info['source']['target']

        # TODO: add error handling in case the target is missing from sources
        source_code = info['source']['sources'][sol_filename]['content']
        
        ast = info['data']['sources'][sol_filename]['legacyAST']
        
        result = ''
        with tempfile.NamedTemporaryFile(suffix='.json') as output_fp:
            with tempfile.NamedTemporaryFile(suffix='.json') as f:
                f.write('== {} ==\n'.format(sol_filename))
                f.write(json.dumps(ast))
                f.flush()

                path = shlex.split('python ./slither/slither.py {} --solc-ast --disable-solc-warnings --solc {} --json {}'.format(f.name, SOLC_PATH, output_fp.name))
                p = subprocess.Popen(path, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                print p.communicate()
                p.wait()

                result = output_fp.read()   
        
        #pprint.pprint(info['data']['contracts'][sol_filename])
        #print info['data']['contracts'][sol_filename].keys()
        
        output = {'status': 1, 'output': result }
        output = json.dumps(output)

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(output)))
        self.end_headers()

        self.wfile.write(output)


    def do_manticore(self, buf):
        output = {"status": 0, "output": "Manticore support coming soon"}

        output = json.dumps(output)

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(output)))
        self.end_headers()
        self.wfile.write(output)


    def do_POST(self):
        if self.path not in ('/slither', '/manticore', '/solium'):
            SimpleHTTPServer.SimpleHTTPRequestHandler.do_POST(self)
            return

        buf = ''
        content_len = int(self.headers.getheader('content-length', 0))
        while len(buf) < content_len:
            buf += self.rfile.read(content_len - len(buf))

        if self.path == '/slither':
            self.do_slither(buf)
        elif self.path == '/manticore':
            self.do_manticore(buf)

PORT = 8000

httpd = MyServer() # SocketServer.TCPServer(("", PORT), MyHandler)

print "Serving at port:", PORT
httpd.serve_forever()
