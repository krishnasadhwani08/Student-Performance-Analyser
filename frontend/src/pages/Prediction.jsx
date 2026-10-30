
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Brain,
  LoaderCircle,
  Calculator
} from "lucide-react";

import { predictStudent } from "../services/api";

const initialForm = {
  gender: "",
  ethnicity: "",
  parental_level_of_education: "",
  lunch: "",
  test_preparation_course: "",
  reading_score: "",
  writing_score: ""
};

function Prediction() {
  const [formData, setFormData] = useState(initialForm);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setPrediction(null);
    setError("");
  };

  // Validate form data
  const validateForm = () => {
    const requiredFields = [
      "gender",
      "ethnicity",
      "parental_level_of_education",
      "lunch",
      "test_preparation_course",
      "reading_score",
      "writing_score"
    ];

    for (const field of requiredFields) {
      if (
        formData[field] === "" ||
        formData[field] === null ||
        formData[field] === undefined
      ) {
        return "Please fill in all fields.";
      }
    }

    const reading = Number(formData.reading_score);
    const writing = Number(formData.writing_score);

    if (!Number.isFinite(reading) || reading < 0 || reading > 100) {
      return "Reading score must be between 0 and 100.";
    }

    if (!Number.isFinite(writing) || writing < 0 || writing > 100) {
      return "Writing score must be between 0 and 100.";
    }

    return null;
  };

  // Submit prediction request
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setPrediction(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const studentData = {
      ...formData,
      reading_score: Number(formData.reading_score),
      writing_score: Number(formData.writing_score)
    };

    console.log("Sending student data:", studentData);

    try {
      const result = await predictStudent(studentData);

      console.log("Backend response:", result);

      if (
        result.prediction === null ||
        result.prediction === undefined ||
        !Number.isFinite(Number(result.prediction))
      ) {
        throw new Error("Backend returned an invalid prediction.");
      }

      setPrediction(Number(result.prediction));

    } catch (err) {
      console.error("Prediction request failed:", err);

      setError(
        err.message || "Unable to generate prediction. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialForm);
    setPrediction(null);
    setError("");
    setLoading(false);
  };

  return (
    <div className="prediction-page">

      {/* Navigation */}
      <nav className="navbar">
        <Link to="/" className="brand">
          <GraduationCap size={30} />
          <span>StudentAnalyser</span>
        </Link>

        <Link to="/" className="back-link">
          <ArrowLeft size={17} />
          Back to Home
        </Link>
      </nav>

      <main className="prediction-container">

        {/* Page Heading */}
        <div className="prediction-heading">
          <span className="eyebrow">STUDENT ANALYSIS</span>

          <h1>Exam Performance Prediction</h1>

          <p>
            Enter the student's information to predict
            their mathematics examination score.
          </p>
        </div>

        {/* Prediction Form */}
        <form onSubmit={handleSubmit} className="prediction-form">

          {/* Student Information */}
          <div className="form-section">
            <h2>01. Student Information</h2>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="gender">Gender</label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ethnicity">Race or Ethnicity</label>

                <select
                  id="ethnicity"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Group</option>

                  {[
                    "group A",
                    "group B",
                    "group C",
                    "group D",
                    "group E"
                  ].map((group) => (
                    <option key={group} value={group}>
                      {group.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="parental_level_of_education">
                  Parental Level of Education
                </label>

                <select
                  id="parental_level_of_education"
                  name="parental_level_of_education"
                  value={formData.parental_level_of_education}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Education</option>

                  {[
                    "associate's degree",
                    "bachelor's degree",
                    "high school",
                    "master's degree",
                    "some college",
                    "some high school"
                  ].map((education) => (
                    <option key={education} value={education}>
                      {education}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="lunch">Lunch Type</label>

                <select
                  id="lunch"
                  name="lunch"
                  value={formData.lunch}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Lunch Type</option>
                  <option value="standard">Standard</option>
                  <option value="free/reduced">Free / Reduced</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="test_preparation_course">
                  Test Preparation Course
                </label>

                <select
                  id="test_preparation_course"
                  name="test_preparation_course"
                  value={formData.test_preparation_course}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Course Status</option>
                  <option value="none">Not Completed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

            </div>
          </div>

          {/* Academic Scores */}
          <div className="form-section">
            <h2>02. Academic Scores</h2>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="reading_score">
                  Reading Score (0-100)
                </label>

                <input
                  id="reading_score"
                  type="number"
                  name="reading_score"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="Enter reading score"
                  value={formData.reading_score}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="writing_score">
                  Writing Score (0-100)
                </label>

                <input
                  id="writing_score"
                  type="number"
                  name="writing_score"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="Enter writing score"
                  value={formData.writing_score}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">

            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={18} />
                  Predicting...
                </>
              ) : (
                <>
                  <Calculator size={18} />
                  Predict Maths Score
                </>
              )}
            </button>

          </div>

        </form>

        {/* Error Message */}
        {error && (
          <div className="error-result" role="alert">
            <strong>Prediction Error</strong>
            <p>{error}</p>
          </div>
        )}

        {/* Prediction Result */}
        {prediction !== null && (
          <div className="result-card" aria-live="polite">

            <div className="result-icon">
              <Brain size={30} />
            </div>

            <span className="eyebrow">PREDICTION RESULT</span>

            <h2>Predicted Mathematics Score</h2>

            <div className="result-score">
              {prediction.toFixed(2)}
              <span>/ 100</span>
            </div>

            <p>
              Your machine learning model has generated
              the predicted mathematics score.
            </p>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer>
        Student Performance Analyser | Machine Learning Project
      </footer>

    </div>
  );
}

export default Prediction;
