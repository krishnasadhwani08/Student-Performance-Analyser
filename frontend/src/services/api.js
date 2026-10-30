
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000"
).replace(/\/$/, "");

export async function predictStudent(studentData) {

  const response = await fetch(
    `${API_BASE_URL}/api/predict`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(studentData)
    }
  );

  const result = await response.json();

  if (!response.ok || result.status !== "success") {
    throw new Error(
      result.message || "Unable to generate prediction."
    );
  }

  return result;
}
