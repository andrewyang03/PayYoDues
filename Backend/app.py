import subprocess
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins":"http://localhost:3000"}})

# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/run-script', methods=['POST'])
def run_script():
    try:
        data = request.json
        message = data.get('message', '') # default to empty string if no message
        sheetID = data.get('sheetID')
        sheetName = data.get('sheetName')
        start = data.get('start')
        end = data.get('end')
        
        load_dotenv(os.path.join(os.pardir, '.env'))
        slack_token = os.getenv('SLACK_TOKEN')
        
        script_path = os.path.join(os.pardir, 'Scripts', 'reminder.py')
        
        result = subprocess.run(['python3', script_path, message, slack_token, sheetID, sheetName, start, end], check=True, text=True, capture_output=True)
        return jsonify({"success": True, "output": result.stdout, "message": "Reminder Processed"})
    except subprocess.CalledProcessError as e:
        return f"Error: {e}"

if __name__ == '__main__':
    app.run(debug=True)