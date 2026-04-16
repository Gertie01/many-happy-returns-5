import os
import json
import base64
from flask import Flask, request, jsonify, send_from_directory
from functools import lru_cache
from utils.generator import MalevichEngine

app = Flask(__name__, static_folder='static')

# Configuration
ALLOWED_MODELS = ["rudalle-Malevich"]

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        prompt = data.get("prompt", "").strip()
        model = data.get("model", "")
        api_key = data.get("api_key", "free-forever-malevich")

        # Validation
        if model not in ALLOWED_MODELS:
            return jsonify({"error": f"Invalid model. Valid models: {ALLOWED_MODELS}"}), 400
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Process Generation
        engine = MalevichEngine()
        image_data = engine.generate_image(prompt)

        return jsonify({
            "status": "success",
            "image": image_data,
            "model": model,
            "usage": "unlimited",
            "license": "Apache-2.0"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)