from flask import Flask, jsonify, render_template
from rssi import get_rssi

app = Flask(__name__)

# Setter en route til HTML siden.
@app.route("/")
def index():
    return render_template("index.html")

# Setter en route til RSSI API-en for å hente ut RSSI-en fra frontend-en
@app.route("/rssi")
def rssi():
    value = get_rssi()
    return jsonify({"rssi": value})

# Starter Flask webserveren
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)