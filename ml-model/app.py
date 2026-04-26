from flask import Flask, request, jsonify
import pickle
import traceback

app = Flask(__name__)

# 🔹 Load model + vectorizer
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.route("/")
def home():
    return "✅ ML API is running"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # 🔒 Safe input handling
        text = data.get("text", "").strip()

        if not text:
            return jsonify({
                "error": "No text provided"
            }), 400

        # 🔹 Convert text → vector
        vec = vectorizer.transform([text])

        # 🔥 Get probability (REAL SCORE)
        prob = model.predict_proba(vec)[0][1] * 100

        # 🔹 Also return prediction
        prediction = int(prob > 50)

        return jsonify({
            "ml_score": round(prob, 2),
            "prediction": prediction
        })

    except Exception as e:
        print("🔥 ERROR:", str(e))
        traceback.print_exc()

        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

# 🔥 Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)