const API_URL =
  "https://student-performance-analyser-7zh9.onrender.com";

async function predictStudent(formData) {
  try {
    const response = await fetch(`${API_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Prediction failed");
    }

    console.log("Predicted score:", result.prediction);

    return result.prediction;

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
