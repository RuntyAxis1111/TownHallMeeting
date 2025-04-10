document.addEventListener('DOMContentLoaded', () => {
  const questionInput = document.getElementById('questionInput');
  const submitButton = document.getElementById('submitButton');
  const feedbackMessage = document.getElementById('feedbackMessage');
  // --- Google Apps Script URL ---
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyrw8BHLKcA6bHx1nFSyx2RUFZng-u6rZbCD6mv0nRKWSCUepRXtUms0U0ygoFrOXk/exec';

  submitButton.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    feedbackMessage.textContent = ''; // Clear previous message
    feedbackMessage.className = 'feedback'; // Reset classes

    if (!question) {
      feedbackMessage.textContent = 'Por favor, escribe una pregunta.';
      feedbackMessage.classList.add('error');
      return;
    }

    try {
      submitButton.disabled = true; // Disable button during submission
      feedbackMessage.textContent = 'Enviando...';
      feedbackMessage.classList.remove('error', 'success'); // Clear status classes

      const response = await fetch(GAS_URL, {
        method: 'POST',
        // Note: Google Apps Script doPost often needs 'text/plain' for simple redirects,
        // but can handle 'application/json' if scripted correctly.
        // We'll assume the script handles JSON. If issues arise, try removing Content-Type
        // or setting to 'application/x-www-form-urlencoded' and adjusting the body.
        headers: {
           // Sending as JSON as requested
           'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
        // mode: 'no-cors' // Use this if GAS doesn't send CORS headers and you don't need the response body
      });

      // Check if the response is OK (status 200-299)
      // Google Apps Script might return redirects (302) or other statuses on success depending on its code.
      // A simple check for ok status might be enough if the script returns 200.
      // If the script redirects, the browser might follow it transparently,
      // and fetch might throw an opaque error or return an opaque response.
      // For simplicity, we'll assume the script returns JSON with a success flag.

      // Try parsing the response as JSON
      let result = {};
      try {
        result = await response.json(); // Expecting { success: true/false, message: "..." }
      } catch (e) {
        // If response is not JSON (e.g., plain text, redirect HTML), handle it
        console.warn("Response was not JSON:", await response.text());
        // Assume success if status is ok, even without JSON
        if (response.ok) {
          result = { success: true, message: 'Pregunta enviada (respuesta no JSON recibida).' };
        } else {
          result = { success: false, message: 'Error al enviar. Respuesta inesperada del servidor.' };
        }
      }


      if (result.success) {
        feedbackMessage.textContent = result.message || '¡Pregunta enviada con éxito!';
        feedbackMessage.classList.add('success');
        questionInput.value = ''; // Clear the input field
      } else {
        feedbackMessage.textContent = result.message || 'Error al enviar la pregunta.';
        feedbackMessage.classList.add('error');
      }

    } catch (error) {
      console.error('Error sending question to Google Apps Script:', error);
      // Network errors or CORS issues might land here
      feedbackMessage.textContent = 'Error de conexión al enviar la pregunta.';
      feedbackMessage.classList.add('error');
    } finally {
       submitButton.disabled = false; // Re-enable button
    }
  });
});
