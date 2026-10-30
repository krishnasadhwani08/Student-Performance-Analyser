
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS

from src.pipeline.predict_pipeline import CustomData, PredictPipeline


# =========================================
# INITIALIZE FLASK APPLICATION
# =========================================

application = Flask(__name__)
app = application


# =========================================
# CONFIGURE CORS
# =========================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "https://student-performance-analyser-3a2d-loaieig99.vercel.app",
                "http://localhost:5173"
            ]
        }
    }
)

# =========================================
# HELPER: GENERATE PREDICTION
# =========================================

def generate_prediction(data):

    required_fields = [
        "gender",
        "ethnicity",
        "parental_level_of_education",
        "lunch",
        "test_preparation_course",
        "reading_score",
        "writing_score"
    ]

    missing_fields = [
        field for field in required_fields
        if data.get(field) is None or str(data.get(field)).strip() == ""
    ]

    if missing_fields:
        raise ValueError(
            f"Missing fields: {', '.join(missing_fields)}"
        )

    reading_score = float(data.get("reading_score"))
    writing_score = float(data.get("writing_score"))

    if not 0 <= reading_score <= 100:
        raise ValueError("Reading score must be between 0 and 100")

    if not 0 <= writing_score <= 100:
        raise ValueError("Writing score must be between 0 and 100")

    student = CustomData(
        gender=data.get("gender"),
        race_ethnicity=data.get("ethnicity"),
        parental_level_of_education=data.get(
            "parental_level_of_education"
        ),
        lunch=data.get("lunch"),
        test_preparation_course=data.get(
            "test_preparation_course"
        ),
        reading_score=reading_score,
        writing_score=writing_score
    )

    pred_df = student.get_data_as_data_frame()

    print("Student Data:")
    print(pred_df)

    predict_pipeline = PredictPipeline()

    results = predict_pipeline.predict(pred_df)

    return float(results[0])


# =========================================
# HOME ROUTE
# =========================================

@app.route("/", methods=["GET"])
def index():

    return render_template("index.html")


# =========================================
# EXISTING HTML PREDICTION ROUTE
# =========================================

@app.route("/predictdata", methods=["GET", "POST"])
def predict_datapoint():

    if request.method == "GET":
        return render_template("home.html")

    try:

        prediction = generate_prediction(request.form)

        return render_template(
            "home.html",
            results=prediction
        )

    except (TypeError, ValueError) as e:

        return render_template(
            "home.html",
            error=str(e)
        ), 400

    except Exception as e:

        print("HTML Prediction Error:", str(e))

        return render_template(
            "home.html",
            error="Prediction failed. Check backend logs."
        ), 500


# =========================================
# REACT FRONTEND REST API
# =========================================

@app.route("/api/predict", methods=["POST"])
def api_predict():

    try:

        data = request.get_json(silent=True)

        if not isinstance(data, dict):
            return jsonify({
                "status": "error",
                "message": "Invalid or missing JSON data"
            }), 400

        prediction = generate_prediction(data)

        print("React Prediction:", prediction)

        return jsonify({
            "status": "success",
            "prediction": prediction
        }), 200

    except (TypeError, ValueError) as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    except Exception as e:

        print("API Prediction Error:", str(e))

        return jsonify({
            "status": "error",
            "message": "Prediction failed. Check backend logs."
        }), 500


# =========================================
# API HEALTH CHECK
# =========================================

@app.route("/api/health", methods=["GET"])
def health_check():

    return jsonify({
        "status": "success",
        "message": "Student Performance API is running"
    }), 200


# =========================================
# ROUTE DIAGNOSTICS
# =========================================

@app.route("/api/routes", methods=["GET"])
def list_routes():

    routes = []

    for rule in app.url_map.iter_rules():

        routes.append({
            "path": rule.rule,
            "methods": sorted(
                method for method in rule.methods
                if method not in ["HEAD", "OPTIONS"]
            )
        })

    return jsonify({
        "status": "success",
        "routes": routes
    }), 200


# =========================================
# APPLICATION ENTRY POINT
# =========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
