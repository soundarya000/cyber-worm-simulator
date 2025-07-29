from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Change this path to your test folder
ROOT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sandbox"))


def build_tree(path):
    node = {"name": os.path.basename(path), "type": "folder", "children": []}
    try:
        for entry in os.scandir(path):
            if entry.is_file():
                node["children"].append({
                    "name": entry.name,
                    "type": "file",
                    "infected": False
                })
            elif entry.is_dir():
                node["children"].append(build_tree(entry.path))
    except PermissionError:
        pass
    return node

@app.route("/api/tree", methods=["GET"])
def get_tree():
    tree = build_tree(ROOT_PATH)
    return jsonify(tree)

@app.route("/api/infect", methods=["POST"])
def infect():
    path = request.json.get("path")
    print(f"Infecting: {path}")  # You could write to logs here
    return jsonify({"status": "infected", "path": path})

@app.route("/")
def home():
    return "🐛 Flask backend is running. Visit /api/tree to view the file tree."


if __name__ == "__main__":
    app.run(debug=True)