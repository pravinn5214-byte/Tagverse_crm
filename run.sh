#!/bin/bash
echo "--------------------------------------------------------"
echo "  Starting Tagverse CRM Local Web Server..."
echo "  Port: 8000"
echo "  URL:  http://localhost:8000"
echo "--------------------------------------------------------"
# Open default browser to the web server URL on macOS
open "http://localhost:8000"
# Run Ruby's built-in HTTP server serving the current directory
ruby -run -e httpd . -p 8000
