# backend/server.py
from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route('/api/posts/fetch-now', methods=['GET'])
def fetch_now():
    result = subprocess.run(['python', 'utils/fetchTelegramData.py'], capture_output=True, text=True)
    if result.returncode == 0:
        return jsonify({"status": "done", "output": result.stdout}), 200
    return jsonify({"status": "error", "message": result.stderr}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))