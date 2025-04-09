document.addEventListener('DOMContentLoaded', () => {
  const questionInput = document.getElementById('questionInput');
  const submitButton = document.getElementById('submitButton');
  const feedbackMessage = document.getElementById('feedbackMessage');

  submitButton.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    feedbackMessage.textContent = ''; // Limpiar mensaje previo
    feedbackMessage.className = 'feedback'; // Resetear clases

    if (!question) {
      feedbackMessage.textContent = 'Por favor, escribe una pregunta.';
      feedbackMessage.classList.add('error');
      return;
    }

    try {
      submitButton.disabled = true; // Deshabilitar botón durante el envío
      feedbackMessage.textContent = 'Enviando...';

      const response = await fetch('/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        feedbackMessage.textContent = '¡Pregunta enviada con éxito!';
        feedbackMessage.classList.add('success');
        questionInput.value = ''; // Limpiar el campo de texto
      } else {
        feedbackMessage.textContent = result.message || 'Error al enviar la pregunta.';
        feedbackMessage.classList.add('error');
      }
    } catch (error) {
      console.error('Error sending question:', error);
      feedbackMessage.textContent = 'Error de conexión al enviar la pregunta.';
      feedbackMessage.classList.add('error');
    } finally {
       submitButton.disabled = false; // Rehabilitar botón
    }
  });
});
