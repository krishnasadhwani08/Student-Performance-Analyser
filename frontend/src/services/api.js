
const API_BASE_URL =
  "https://student-performance-analyser-7zh9.onrender.com";

export async function predictStudent(studentData) {
  console.log("API request URL:", `${API_BASE_URL}/api/predict`);
  console.log("Student data:", studentData);

  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    const result = await response.json();

    console.log("Backend response:", result);

    if (!response.ok || result.status !== "success") {
      throw new Error(
        result.message || `Request failed: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
