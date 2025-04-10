import './style.css'

const questionInput = document.getElementById('questionInput');
const submitButton = document.getElementById('submitButton');
const responseMessage = document.getElementById('responseMessage');

// Your Google Apps Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrJwQiw72THiayXJiAh4pFuaxHSC13fw9NXaVRynjPkVxuNwhR7ov6YVblupdwrusW/exec";

submitButton.addEventListener('click', async () => {
  const question = questionInput.value.trim();

  if (!question) {
    responseMessage.textContent = 'Por favor, escribe una pregunta.';
    responseMessage.className = 'error'; // Use class for styling
    return;
  }

  // Disable button and show loading state (optional)
  submitButton.disabled = true;
  responseMessage.textContent = 'Enviando...';
  responseMessage.className = ''; // Reset class

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      // mode: 'cors', // CORS is handled by Apps Script headers, but sometimes needed explicitly
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded', // Use this if your Apps Script expects form data
        'Content-Type': 'application/json' // Use this if your Apps Script expects JSON
      },
      // body: new URLSearchParams({ question: question }) // For application/x-www-form-urlencoded
      body: JSON.stringify({ question: question }) // For application/json
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
        // Try to parse error response from Apps Script if available
        let errorMsg = `Error HTTP: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch (parseError) {
            // If response is not JSON or empty
            console.error("Could not parse error response:", parseError);
        }
        throw new Error(errorMsg);
    }

    const result = await response.json();

    if (result.success) {
      responseMessage.textContent = result.message || '¡Pregunta enviada con éxito!';
      responseMessage.className = 'success';
      questionInput.value = ''; // Clear the textarea
    } else {
      responseMessage.textContent = `Error: ${result.message || 'Ocurrió un error desconocido.'}`;
      responseMessage.className = 'error';
    }

  } catch (error) {
    console.error('Error sending question:', error);
    responseMessage.textContent = `Error al enviar: ${error.message}`;
    responseMessage.className = 'error';
  } finally {
    // Re-enable button regardless of success or error
    submitButton.disabled = false;
  }
});
