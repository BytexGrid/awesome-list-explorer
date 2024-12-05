from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import webbrowser
from pathlib import Path

def run_server(port=8000):
    # Get the directory containing this script
    current_dir = Path(__file__).parent.absolute()
    
    # Change to the project directory
    os.chdir(current_dir)
    
    # Create server
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    
    # Open browser automatically
    webbrowser.open(f'http://localhost:{port}')
    
    # Print server info
    print(f"""
    🚀 Server started successfully!
    
    📂 Serving files from: {current_dir}
    🌐 Local URL: http://localhost:{port}
    
    Press Ctrl+C to stop the server
    """)
    
    # Start server
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")

if __name__ == '__main__':
    run_server()
