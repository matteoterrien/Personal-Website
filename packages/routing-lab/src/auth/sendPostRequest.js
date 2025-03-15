export async function sendPostRequest(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { status: response.status, ...errorData };
    }

    const data = await response.json();
    return { status: response.status, ...data };
  } catch (error) {
    return { status: 500, error: "Network error." };
  }
}
