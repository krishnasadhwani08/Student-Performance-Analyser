
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setPrediction(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const studentData = {
        ...formData,
        reading_score: Number(formData.reading_score),
        writing_score: Number(formData.writing_score)
      };

      const result = await predictStudent(studentData);

      setPrediction(result.prediction);

    } catch (err) {
      setError(err.message || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setPrediction(null);
    setError("");
  };

  return (
    <div className="prediction-page">

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

        <div className="prediction-heading">
          <span className="eyebrow">STUDENT ANALYSIS</span>

          <h1>Exam Performance Prediction</h1>

          <p>
            Enter the student's information to predict
            their mathematics examination score.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="prediction-form">

          <div className="form-section">
            <h2>01. Student Information</h2>

            <div className="form-grid">

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Race or Ethnicity</label>
                <select
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Group</option>
                  {["group A", "group B", "group C", "group D", "group E"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group.toUpperCase()}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Parental Level of Education</label>
                <select
                  name="parental_level_of_education"
                  value={formData.parental_level_of_education}
                  onChange={handleChange}
                  required
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
                <label>Lunch Type</label>
                <select
                  name="lunch"
                  value={formData.lunch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Lunch Type</option>
                  <option value="standard">Standard</option>
                  <option value="free/reduced">Free / Reduced</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Test Preparation Course</label>
                <select
                  name="test_preparation_course"
                  value={formData.test_preparation_course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course Status</option>
                  <option value="none">Not Completed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

            </div>
          </div>

          <div className="form-section">
            <h2>02. Academic Scores</h2>

            <div className="form-grid">

              <div className="form-group">
                <label>Reading Score (0-100)</label>
                <input
                  type="number"
                  name="reading_score"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="Enter reading score"
                  value={formData.reading_score}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Writing Score (0-100)</label>
                <input
                  type="number"
                  name="writing_score"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="Enter writing score"
                  value={formData.writing_score}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </div>

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

        {error && (
          <div className="error-result" role="alert">
            <strong>Prediction Error</strong>
            <p>{error}</p>
          </div>
        )}

        {prediction !== null && (
          <div className="result-card" aria-live="polite">
            <div className="result-icon">
              <Brain size={30} />
            </div>

            <span className="eyebrow">PREDICTION RESULT</span>

            <h2>Predicted Mathematics Score</h2>

            <div className="result-score">
              {Number(prediction).toFixed(2)}
              <span>/ 100</span>
            </div>

            <p>
              Your machine learning model has generated
              the predicted mathematics score.
            </p>
          </div>
        )}

      </main>

      <footer>
        Student Performance Analyser | Machine Learning Project
      </footer>

    </div>
  );
}

export default Prediction;
