
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler
from src.pipeline.predict_pipeline import CustomData, PredictPipeline


# Initialize Flask application
application = Flask(__name__)

app = application


# Configure CORS
CORS(app, origins=[
    "https://YOUR-FRONTEND.vercel.app",
    "http://localhost:5173"
])


# -----------------------------------------
# HOME ROUTE
# -----------------------------------------

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


# -----------------------------------------
# EXISTING HTML PREDICTION ROUTE
# -----------------------------------------

@app.route('/predictdata', methods=['GET', 'POST'])
def predict_datapoint():

    if request.method == 'GET':
        return render_template('home.html')

    else:
        data = CustomData(
            gender=request.form.get('gender'),
            race_ethnicity=request.form.get('ethnicity'),
            parental_level_of_education=request.form.get(
                'parental_level_of_education'
            ),
            lunch=request.form.get('lunch'),
            test_preparation_course=request.form.get(
                'test_preparation_course'
            ),
            reading_score=float(request.form.get('reading_score')),
            writing_score=float(request.form.get('writing_score'))
        )

        pred_df = data.get_data_as_data_frame()

        print(pred_df)
        print("Before Prediction")

        predict_pipeline = PredictPipeline()

        print("Mid Prediction")

        results = predict_pipeline.predict(pred_df)

        print("After Prediction")

        return render_template(
            'home.html',
            results=results[0]
        )


# -----------------------------------------
# NEW REST API FOR REACT FRONTEND
# -----------------------------------------

@app.route('/api/predict', methods=['POST'])
def api_predict():

    try:

        # Receive JSON data from React
        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "No student data received"
            }), 400

        # Prepare student data
        student = CustomData(
            gender=data.get('gender'),
            race_ethnicity=data.get('ethnicity'),
            parental_level_of_education=data.get(
                'parental_level_of_education'
            ),
            lunch=data.get('lunch'),
            test_preparation_course=data.get(
                'test_preparation_course'
            ),
            reading_score=float(data.get('reading_score')),
            writing_score=float(data.get('writing_score'))
        )

        # Convert input into DataFrame
        pred_df = student.get_data_as_data_frame()

        print("Received Student Data:")
        print(pred_df)

        # Load prediction pipeline and predict
        predict_pipeline = PredictPipeline()

        results = predict_pipeline.predict(pred_df)

        prediction = float(results[0])

        print("Prediction:", prediction)

        # Return prediction to React
        return jsonify({
            "status": "success",
            "prediction": prediction
        }), 200

    except (TypeError, ValueError) as e:

        return jsonify({
            "status": "error",
            "message": f"Invalid student input: {str(e)}"
        }), 400

    except Exception as e:

        print("Prediction Error:", str(e))

        return jsonify({
            "status": "error",
            "message": "Prediction failed. Check backend logs."
        }), 500


# -----------------------------------------
# APPLICATION ENTRY POINT
# -----------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
