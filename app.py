from flask import Flask, jsonify, render_template
from rssi import get_rssi

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/rssi")
def rssi():
    value = get_rssi()
    return jsonify({"rssi": value})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)