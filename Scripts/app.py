import subprocess
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run-script', methods=['POST'])
def run_script():
    try:
        data = request.json
        message = data.get('message', '') # default to empty string if no message
        result = subprocess.run(['python3', 'reminder.py', message], check=True, text=True, capture_output=True)
        return jsonify({"success": True, "output": result.stdout, "message": "Reminder Processed"})
    except subprocess.CalledProcessError as e:
        return f"Error: {e}"

if __name__ == '__main__':
    app.run(debug=True)