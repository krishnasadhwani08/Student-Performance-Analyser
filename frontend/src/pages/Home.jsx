
import { Link } from "react-router-dom";
import {
  GraduationCap,
  ArrowRight,
  Brain,
  ChartNoAxesCombined,
  Target,
  BookOpen
} from "lucide-react";

function Home() {
  return (
    <div className="home-page">

      <nav className="navbar">
        <Link to="/" className="brand">
          <GraduationCap size={30} />
          <span>StudentAnalyser</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/predict">Prediction</Link>
        </div>
      </nav>

      <section className="hero">

        <div className="hero-content">
          <span className="eyebrow">
            MACHINE LEARNING POWERED ANALYSIS
          </span>

          <h1>
            Understand Student Performance.
            <span> Predict Academic Outcomes.</span>
          </h1>

          <p>
            Analyse student information and predict mathematics
            examination scores using machine learning.
            Discover meaningful patterns in academic performance.
          </p>

          <div className="hero-actions">
            <Link to="/predict" className="primary-btn">
              Start Prediction
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-note">
            <Brain size={17} />
            Powered by a trained machine learning model
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <ChartNoAxesCombined size={55} />

            <h3>Academic Intelligence</h3>

            <p>
              Transform student data into useful predictions.
            </p>

            <div className="visual-stats">
              <div>
                <Target size={20} />
                <span>Score Prediction</span>
              </div>

              <div>
                <BookOpen size={20} />
                <span>Student Analysis</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      <section className="features">
        <h2>What does this platform offer?</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <Brain size={30} />
            <h3>ML Prediction</h3>
            <p>
              Predict mathematics examination scores
              using student academic information.
            </p>
          </div>

          <div className="feature-card">
            <ChartNoAxesCombined size={30} />
            <h3>Performance Insights</h3>
            <p>
              Explore patterns and relationships
              in student performance.
            </p>
          </div>

          <div className="feature-card">
            <GraduationCap size={30} />
            <h3>Student Analysis</h3>
            <p>
              Understand how different student
              characteristics relate to academic outcomes.
            </p>
          </div>

        </div>
      </section>

      <footer>
        Student Performance Analyser | Machine Learning Project
      </footer>

    </div>
  );
}

export default Home;
