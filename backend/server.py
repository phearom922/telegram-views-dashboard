# backend/server.py
from flask import Flask, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/api/posts/fetch-now', methods=['GET'])
def fetch_now():
    try:
        # รัน fetchTelegramData.py
        result = subprocess.run(['python', 'utils/fetchTelegramData.py'], capture_output=True, text=True)
        if result.returncode != 0:
            return jsonify({"status": "error", "message": result.stderr}), 500
        return jsonify({"status": "done"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))